
"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

type FrameData = {
  mudra: string;
  timestamp: number;
  poseLandmarks?: Landmark[];
  leftHandLandmarks?: Landmark[];
  rightHandLandmarks?: Landmark[];
};

const MUDRAS = ["Pataka", "Tripataka", "Ardhapataka", "Arala", "Shukatunda"];

const DatasetCollector = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fps, setFps] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState({
    pose: false,
    leftHand: false,
    rightHand: false,
  });

  // Dataset collection state
  const [currentMudra, setCurrentMudra] = useState<string>(MUDRAS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [collectedData, setCollectedData] = useState<FrameData[]>([]);
  const recordingRef = useRef<FrameData[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let holistic: any;
    let animationFrame: number;
    let lastFrameTime = 0;
    let frameCount = 0;
    let fpsUpdateTime = performance.now();
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const loadScripts = async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });

        const Holistic = (window as any).Holistic;
        const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
        const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

        holistic = new Holistic({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        holistic.onResults((results: any) => {
          const canvas = canvasRef.current;
          const video = webcamRef.current?.video;

          if (!canvas || !video) return;

          frameCount++;
          const now = performance.now();
          if (now - fpsUpdateTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            fpsUpdateTime = now;
          }

          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          setDetectionStatus({
            pose: !!results.poseLandmarks,
            leftHand: !!results.leftHandLandmarks,
            rightHand: !!results.rightHandLandmarks,
          });

          // Collect data if recording
          if (isRecording && (results.poseLandmarks || results.leftHandLandmarks || results.rightHandLandmarks)) {
            const frame: FrameData = {
              mudra: currentMudra,
              timestamp: Date.now(),
              poseLandmarks: results.poseLandmarks || [],
              leftHandLandmarks: results.leftHandLandmarks || [],
              rightHandLandmarks: results.rightHandLandmarks || [],
            };
            recordingRef.current.push(frame);
          }

          if (results.poseLandmarks && POSE_CONNECTIONS) {
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 4,
            });
            drawLandmarks(ctx, results.poseLandmarks, {
              color: "#FF0000",
              fillColor: "#FF0000",
              radius: 5,
            });
          }

          if (results.leftHandLandmarks && HAND_CONNECTIONS) {
            drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
              color: "#00FFFF",
              lineWidth: 3,
            });
            drawLandmarks(ctx, results.leftHandLandmarks, {
              color: "#0000FF",
              fillColor: "#0000FF",
              radius: 4,
            });
          }

          if (results.rightHandLandmarks && HAND_CONNECTIONS) {
            drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
              color: "#FFFF00",
              lineWidth: 3,
            });
            drawLandmarks(ctx, results.rightHandLandmarks, {
              color: "#FFA500",
              fillColor: "#FFA500",
              radius: 4,
            });
          }

          ctx.restore();
        });

        setIsLoading(false);

        const sendFrame = async (timestamp: number) => {
          if (timestamp - lastFrameTime < frameInterval) {
            animationFrame = requestAnimationFrame(sendFrame);
            return;
          }
          lastFrameTime = timestamp;

          if (webcamRef.current?.video?.readyState === 4) {
            await holistic.send({ image: webcamRef.current.video });
          }
          animationFrame = requestAnimationFrame(sendFrame);
        };
        requestAnimationFrame(sendFrame);
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
        setIsLoading(false);
      }
    };

    loadScripts();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (holistic) {
        holistic.close();
      }
    };
  }, [isRecording, currentMudra]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    style: any
  ) => {
    landmarks.forEach((landmark) => {
      ctx.fillStyle = style.fillColor || style.color;
      ctx.beginPath();
      ctx.arc(
        landmark.x * ctx.canvas.width,
        landmark.y * ctx.canvas.height,
        style.radius || 3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  };

  const drawConnectors = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: any[],
    style: any
  ) => {
    if (!connections || !Array.isArray(connections)) return;

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth || 2;

    connections.forEach(([start, end]: [number, number]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(
          startPoint.x * ctx.canvas.width,
          startPoint.y * ctx.canvas.height
        );
        ctx.lineTo(
          endPoint.x * ctx.canvas.width,
          endPoint.y * ctx.canvas.height
        );
        ctx.stroke();
      }
    });
  };

  const startRecording = () => {
    recordingRef.current = [];
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setCollectedData((prev) => [...prev, ...recordingRef.current]);
  };

  const downloadJSON = () => {
    if (collectedData.length === 0) {
      alert("No data to download!");
      return;
    }

    const blob = new Blob([JSON.stringify(collectedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mudra_dataset_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (collectedData.length === 0) {
      alert("No data to download!");
      return;
    }

    let csv = "mudra,timestamp,pose_landmarks,left_hand_landmarks,right_hand_landmarks\n";

    collectedData.forEach((frame) => {
      const poseStr = JSON.stringify(frame.poseLandmarks || []);
      const leftHandStr = JSON.stringify(frame.leftHandLandmarks || []);
      const rightHandStr = JSON.stringify(frame.rightHandLandmarks || []);
      
      csv += `"${frame.mudra}",${frame.timestamp},"${poseStr}","${leftHandStr}","${rightHandStr}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mudra_dataset_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all collected data?")) {
      setCollectedData([]);
      recordingRef.current = [];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Sattriya Mudra Dataset Collector</h1>
        <p className="text-gray-400">Real-time Pose & Hand Tracking for Dance Recognition</p>
      </div>

      {/* Main Content - Webcam Feed */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="relative w-full h-[70vh] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-white text-2xl">Loading MediaPipe...</div>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 rounded-full z-20 flex items-center gap-3 animate-pulse shadow-2xl">
              <div className="w-5 h-5 bg-white rounded-full"></div>
              <span className="font-bold text-2xl">RECORDING - {formatTime(recordingDuration)}</span>
            </div>
          )}

          {/* Side Control Panel Overlay */}
          <div className="absolute top-6 right-6 w-80 bg-black bg-opacity-90 backdrop-blur-md rounded-xl p-5 z-20 border border-gray-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Controls</h3>
            
            {/* Mudra Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-300 mb-2">Select Mudra:</label>
              <select
                value={currentMudra}
                onChange={(e) => setCurrentMudra(e.target.value)}
                disabled={isRecording}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50 text-sm"
              >
                {MUDRAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="bg-gray-800 rounded-lg p-3 mb-4 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">FPS:</span>
                <span className="text-green-400 font-bold">{fps}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Pose:</span>
                <span className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
                  {detectionStatus.pose ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">L-Hand:</span>
                <span className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
                  {detectionStatus.leftHand ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">R-Hand:</span>
                <span className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
                  {detectionStatus.rightHand ? "✓" : "✗"}
                </span>
              </div>
            </div>

            {/* Recording Button */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!detectionStatus.pose && !detectionStatus.leftHand && !detectionStatus.rightHand}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded-lg font-bold mb-3 transition"
              >
                ▶ Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold mb-3 transition"
              >
                ⏹ Stop Recording
              </button>
            )}

            {/* Stats */}
            <div className="bg-gray-800 rounded-lg p-3 mb-3 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Total Frames:</span>
                <span className="text-white font-bold">{collectedData.length}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Session:</span>
                <span className="text-white font-bold">{recordingRef.current.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-bold font-mono">{formatTime(recordingDuration)}</span>
              </div>
            </div>

            {/* Download Buttons */}
            <button
              onClick={downloadJSON}
              disabled={collectedData.length === 0}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg text-sm mb-2 transition"
            >
              ⬇ Download JSON
            </button>
            <button
              onClick={downloadCSV}
              disabled={collectedData.length === 0}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg text-sm mb-2 transition"
            >
              ⬇ Download CSV
            </button>
            <button
              onClick={clearData}
              disabled={collectedData.length === 0}
              className="w-full py-2 bg-gray-700 hover:bg-red-600 disabled:bg-gray-700 text-white rounded-lg text-sm transition"
            >
              🗑 Clear Data
            </button>
          </div>

          {/* Current Mudra Badge */}
          <div className="absolute bottom-6 left-6 bg-purple-600 text-white px-6 py-3 rounded-lg z-20 shadow-lg">
            <div className="text-xs opacity-80">Current Mudra</div>
            <div className="font-bold text-xl">{currentMudra}</div>
          </div>

          <Webcam
            ref={webcamRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            videoConstraints={{
              width: 1920,
              height: 1080,
              facingMode: "user",
              frameRate: { ideal: 30, max: 30 },
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>

      {/* Instructions Below Webcam */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 border-2 border-blue-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📋 Recording Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-100">
            <li>Select the mudra you want to record from the dropdown</li>
            <li>Position yourself in front of the camera ensuring full body visibility</li>
            <li>Perform the selected mudra clearly</li>
            <li>Click "Start Recording" and hold the pose for 5-10 seconds</li>
            <li>Click "Stop Recording" when done</li>
            <li>Repeat from different angles and distances for better dataset</li>
            <li>Switch mudras and repeat the process</li>
            <li>Download your dataset as JSON or CSV when finished</li>
          </ol>
        </div>

        {/* Sample Distribution */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">📊 Sample Distribution</h3>
          <div className="space-y-3">
            {MUDRAS.map((mudra) => {
              const count = collectedData.filter((f) => f.mudra === mudra).length;
              const maxCount = Math.max(...MUDRAS.map(m => collectedData.filter(f => f.mudra === m).length), 1);
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={mudra}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 font-medium">{mudra}</span>
                    <span className="text-white font-bold">{count} frames</span>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <div className="text-3xl font-bold text-white">{collectedData.length}</div>
            <div className="text-sm text-gray-400">Total Frames Collected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetCollector;
