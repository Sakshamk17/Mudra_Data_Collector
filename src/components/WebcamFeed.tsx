
// // // // "use client";

// // // // import React, { useRef, useEffect, useState } from "react";
// // // // import Webcam from "react-webcam";

// // // // const WebcamFeed: React.FC = () => {
// // // //   const webcamRef = useRef<Webcam>(null);
// // // //   const canvasRef = useRef<HTMLCanvasElement>(null);
// // // //   const [isLoading, setIsLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     let holistic: any;
// // // //     let animationFrame: number;

// // // //     const loadScripts = async () => {
// // // //       try {
// // // //         // Load drawing utils
// // // //         await new Promise<void>((resolve, reject) => {
// // // //           const script = document.createElement("script");
// // // //           script.src =
// // // //             "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
// // // //           script.onload = () => resolve();
// // // //           script.onerror = reject;
// // // //           document.body.appendChild(script);
// // // //         });

// // // //         // Load holistic
// // // //         await new Promise<void>((resolve, reject) => {
// // // //           const script = document.createElement("script");
// // // //           script.src =
// // // //             "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
// // // //           script.onload = () => resolve();
// // // //           script.onerror = reject;
// // // //           document.body.appendChild(script);
// // // //         });

// // // //         const Holistic = (window as any).Holistic;
// // // //         const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
// // // //         const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

// // // //         holistic = new Holistic({
// // // //           locateFile: (file: string) =>
// // // //             `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
// // // //         });

// // // //         holistic.setOptions({
// // // //           modelComplexity: 1,
// // // //           smoothLandmarks: true,
// // // //           minDetectionConfidence: 0.5,
// // // //           minTrackingConfidence: 0.5,
// // // //         });

// // // //         holistic.onResults((results: any) => {
// // // //           const canvas = canvasRef.current;
// // // //           const video = webcamRef.current?.video;
          
// // // //           if (!canvas || !video) return;

// // // //           // Set canvas dimensions to match video
// // // //           if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
// // // //             canvas.width = video.videoWidth;
// // // //             canvas.height = video.videoHeight;
// // // //           }

// // // //           const ctx = canvas.getContext("2d");
// // // //           if (!ctx) return;

// // // //           ctx.save();
// // // //           ctx.clearRect(0, 0, canvas.width, canvas.height);

// // // //           // Draw pose landmarks
// // // //           if (results.poseLandmarks && POSE_CONNECTIONS) {
// // // //             drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
// // // //               color: "#00FF00",
// // // //               lineWidth: 4,
// // // //             });
// // // //             drawLandmarks(ctx, results.poseLandmarks, {
// // // //               color: "#FF0000",
// // // //               fillColor: "#FF0000",
// // // //               radius: 5,
// // // //             });
// // // //           }

// // // //           // Draw left hand
// // // //           if (results.leftHandLandmarks && HAND_CONNECTIONS) {
// // // //             drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
// // // //               color: "#00FFFF",
// // // //               lineWidth: 3,
// // // //             });
// // // //             drawLandmarks(ctx, results.leftHandLandmarks, {
// // // //               color: "#0000FF",
// // // //               fillColor: "#0000FF",
// // // //               radius: 4,
// // // //             });
// // // //           }

// // // //           // Draw right hand
// // // //           if (results.rightHandLandmarks && HAND_CONNECTIONS) {
// // // //             drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
// // // //               color: "#FFFF00",
// // // //               lineWidth: 3,
// // // //             });
// // // //             drawLandmarks(ctx, results.rightHandLandmarks, {
// // // //               color: "#FFA500",
// // // //               fillColor: "#FFA500",
// // // //               radius: 4,
// // // //             });
// // // //           }

// // // //           ctx.restore();
// // // //         });

// // // //         setIsLoading(false);

// // // //         const sendFrame = async () => {
// // // //           if (webcamRef.current?.video?.readyState === 4) {
// // // //             await holistic.send({ image: webcamRef.current.video });
// // // //           }
// // // //           animationFrame = requestAnimationFrame(sendFrame);
// // // //         };
// // // //         sendFrame();
// // // //       } catch (error) {
// // // //         console.error("Error loading MediaPipe:", error);
// // // //         setIsLoading(false);
// // // //       }
// // // //     };

// // // //     loadScripts();

// // // //     return () => {
// // // //       if (animationFrame) {
// // // //         cancelAnimationFrame(animationFrame);
// // // //       }
// // // //       if (holistic) {
// // // //         holistic.close();
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   // Helper functions to draw landmarks and connections
// // // //   const drawLandmarks = (
// // // //     ctx: CanvasRenderingContext2D,
// // // //     landmarks: any[],
// // // //     style: any
// // // //   ) => {
// // // //     landmarks.forEach((landmark) => {
// // // //       ctx.fillStyle = style.fillColor || style.color;
// // // //       ctx.beginPath();
// // // //       ctx.arc(
// // // //         landmark.x * ctx.canvas.width,
// // // //         landmark.y * ctx.canvas.height,
// // // //         style.radius || 3,
// // // //         0,
// // // //         2 * Math.PI
// // // //       );
// // // //       ctx.fill();
// // // //     });
// // // //   };

// // // //   const drawConnectors = (
// // // //     ctx: CanvasRenderingContext2D,
// // // //     landmarks: any[],
// // // //     connections: any[],
// // // //     style: any
// // // //   ) => {
// // // //     if (!connections || !Array.isArray(connections)) return;
    
// // // //     ctx.strokeStyle = style.color;
// // // //     ctx.lineWidth = style.lineWidth || 2;

// // // //     connections.forEach(([start, end]: [number, number]) => {
// // // //       const startPoint = landmarks[start];
// // // //       const endPoint = landmarks[end];

// // // //       if (startPoint && endPoint) {
// // // //         ctx.beginPath();
// // // //         ctx.moveTo(
// // // //           startPoint.x * ctx.canvas.width,
// // // //           startPoint.y * ctx.canvas.height
// // // //         );
// // // //         ctx.lineTo(
// // // //           endPoint.x * ctx.canvas.width,
// // // //           endPoint.y * ctx.canvas.height
// // // //         );
// // // //         ctx.stroke();
// // // //       }
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
// // // //       {isLoading && (
// // // //         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
// // // //           <div className="text-white text-lg">Loading MediaPipe...</div>
// // // //         </div>
// // // //       )}
// // // //       <Webcam
// // // //         ref={webcamRef}
// // // //         className="absolute top-0 left-0 w-full h-full object-cover"
// // // //         videoConstraints={{
// // // //           width: 640,
// // // //           height: 480,
// // // //           facingMode: "user",
// // // //         }}
// // // //       />
// // // //       <canvas
// // // //         ref={canvasRef}
// // // //         className="absolute top-0 left-0 w-full h-full"
// // // //         style={{ pointerEvents: "none" }}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // // Export the WebcamFeed component for use in page.tsx
// // // // export { WebcamFeed };
// // // "use client";

// // // import React, { useRef, useEffect, useState } from "react";
// // // import Webcam from "react-webcam";

// // // const WebcamFeed: React.FC = () => {
// // //   const webcamRef = useRef<Webcam>(null);
// // //   const canvasRef = useRef<HTMLCanvasElement>(null);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [detectionStatus, setDetectionStatus] = useState({
// // //     pose: false,
// // //     leftHand: false,
// // //     rightHand: false,
// // //     face: false,
// // //   });

// // //   useEffect(() => {
// // //     let holistic: any;
// // //     let animationFrame: number;

// // //     const loadScripts = async () => {
// // //       try {
// // //         // Load drawing utils
// // //         await new Promise<void>((resolve, reject) => {
// // //           const script = document.createElement("script");
// // //           script.src =
// // //             "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
// // //           script.onload = () => resolve();
// // //           script.onerror = reject;
// // //           document.body.appendChild(script);
// // //         });

// // //         // Load holistic
// // //         await new Promise<void>((resolve, reject) => {
// // //           const script = document.createElement("script");
// // //           script.src =
// // //             "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
// // //           script.onload = () => resolve();
// // //           script.onerror = reject;
// // //           document.body.appendChild(script);
// // //         });

// // //         const Holistic = (window as any).Holistic;
// // //         const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
// // //         const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;
// // //         const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;

// // //         holistic = new Holistic({
// // //           locateFile: (file: string) =>
// // //             `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
// // //         });

// // //         holistic.setOptions({
// // //           modelComplexity: 1,
// // //           smoothLandmarks: true,
// // //           enableSegmentation: false,
// // //           smoothSegmentation: false,
// // //           refineFaceLandmarks: true,
// // //           minDetectionConfidence: 0.5,
// // //           minTrackingConfidence: 0.5,
// // //         });

// // //         holistic.onResults((results: any) => {
// // //           const canvas = canvasRef.current;
// // //           const video = webcamRef.current?.video;
          
// // //           if (!canvas || !video) return;

// // //           // Set canvas dimensions to match video
// // //           if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
// // //             canvas.width = video.videoWidth;
// // //             canvas.height = video.videoHeight;
// // //           }

// // //           const ctx = canvas.getContext("2d");
// // //           if (!ctx) return;

// // //           ctx.save();
// // //           ctx.clearRect(0, 0, canvas.width, canvas.height);

// // //           // Update detection status
// // //           setDetectionStatus({
// // //             pose: !!results.poseLandmarks,
// // //             leftHand: !!results.leftHandLandmarks,
// // //             rightHand: !!results.rightHandLandmarks,
// // //             face: !!results.faceLandmarks,
// // //           });

// // //           // Draw face mesh
// // //           if (results.faceLandmarks && FACEMESH_TESSELATION) {
// // //             drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
// // //               color: "#C0C0C070",
// // //               lineWidth: 1,
// // //             });
// // //           }

// // //           // Draw pose landmarks
// // //           if (results.poseLandmarks && POSE_CONNECTIONS) {
// // //             drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
// // //               color: "#00FF00",
// // //               lineWidth: 4,
// // //             });
// // //             drawLandmarks(ctx, results.poseLandmarks, {
// // //               color: "#FF0000",
// // //               fillColor: "#FF0000",
// // //               radius: 5,
// // //             });
// // //           }

// // //           // Draw left hand
// // //           if (results.leftHandLandmarks && HAND_CONNECTIONS) {
// // //             drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
// // //               color: "#00FFFF",
// // //               lineWidth: 3,
// // //             });
// // //             drawLandmarks(ctx, results.leftHandLandmarks, {
// // //               color: "#0000FF",
// // //               fillColor: "#0000FF",
// // //               radius: 4,
// // //             });
// // //           }

// // //           // Draw right hand
// // //           if (results.rightHandLandmarks && HAND_CONNECTIONS) {
// // //             drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
// // //               color: "#FFFF00",
// // //               lineWidth: 3,
// // //             });
// // //             drawLandmarks(ctx, results.rightHandLandmarks, {
// // //               color: "#FFA500",
// // //               fillColor: "#FFA500",
// // //               radius: 4,
// // //             });
// // //           }

// // //           ctx.restore();
// // //         });

// // //         setIsLoading(false);

// // //         const sendFrame = async () => {
// // //           if (webcamRef.current?.video?.readyState === 4) {
// // //             await holistic.send({ image: webcamRef.current.video });
// // //           }
// // //           animationFrame = requestAnimationFrame(sendFrame);
// // //         };
// // //         sendFrame();
// // //       } catch (error) {
// // //         console.error("Error loading MediaPipe:", error);
// // //         setIsLoading(false);
// // //       }
// // //     };

// // //     loadScripts();

// // //     return () => {
// // //       if (animationFrame) {
// // //         cancelAnimationFrame(animationFrame);
// // //       }
// // //       if (holistic) {
// // //         holistic.close();
// // //       }
// // //     };
// // //   }, []);

// // //   // Helper functions to draw landmarks and connections
// // //   const drawLandmarks = (
// // //     ctx: CanvasRenderingContext2D,
// // //     landmarks: any[],
// // //     style: any
// // //   ) => {
// // //     landmarks.forEach((landmark) => {
// // //       ctx.fillStyle = style.fillColor || style.color;
// // //       ctx.beginPath();
// // //       ctx.arc(
// // //         landmark.x * ctx.canvas.width,
// // //         landmark.y * ctx.canvas.height,
// // //         style.radius || 3,
// // //         0,
// // //         2 * Math.PI
// // //       );
// // //       ctx.fill();
// // //     });
// // //   };

// // //   const drawConnectors = (
// // //     ctx: CanvasRenderingContext2D,
// // //     landmarks: any[],
// // //     connections: any[],
// // //     style: any
// // //   ) => {
// // //     if (!connections || !Array.isArray(connections)) return;
    
// // //     ctx.strokeStyle = style.color;
// // //     ctx.lineWidth = style.lineWidth || 2;

// // //     connections.forEach(([start, end]: [number, number]) => {
// // //       const startPoint = landmarks[start];
// // //       const endPoint = landmarks[end];

// // //       if (startPoint && endPoint) {
// // //         ctx.beginPath();
// // //         ctx.moveTo(
// // //           startPoint.x * ctx.canvas.width,
// // //           startPoint.y * ctx.canvas.height
// // //         );
// // //         ctx.lineTo(
// // //           endPoint.x * ctx.canvas.width,
// // //           endPoint.y * ctx.canvas.height
// // //         );
// // //         ctx.stroke();
// // //       }
// // //     });
// // //   };

// // //   return (
// // //     <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
// // //       {isLoading && (
// // //         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
// // //           <div className="text-white text-lg">Loading MediaPipe...</div>
// // //         </div>
// // //       )}
      
// // //       {/* Detection Status Overlay */}
// // //       <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-20 font-mono">
// // //         <div className={detectionStatus.face ? "text-green-400" : "text-red-400"}>
// // //           Face: {detectionStatus.face ? "✓" : "✗"}
// // //         </div>
// // //         <div className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
// // //           Pose: {detectionStatus.pose ? "✓" : "✗"}
// // //         </div>
// // //         <div className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
// // //           L-Hand: {detectionStatus.leftHand ? "✓" : "✗"}
// // //         </div>
// // //         <div className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
// // //           R-Hand: {detectionStatus.rightHand ? "✓" : "✗"}
// // //         </div>
// // //       </div>

// // //       <Webcam
// // //         ref={webcamRef}
// // //         className="absolute top-0 left-0 w-full h-full object-cover"
// // //         videoConstraints={{
// // //           width: 640,
// // //           height: 480,
// // //           facingMode: "user",
// // //         }}
// // //       />
// // //       <canvas
// // //         ref={canvasRef}
// // //         className="absolute top-0 left-0 w-full h-full"
// // //         style={{ pointerEvents: "none" }}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // // Export the WebcamFeed component for use in page.tsx
// // // export { WebcamFeed };
// // "use client";

// // import React, { useRef, useEffect, useState } from "react";
// // import Webcam from "react-webcam";

// // const WebcamFeed: React.FC = () => {
// //   const webcamRef = useRef<Webcam>(null);
// //   const canvasRef = useRef<HTMLCanvasElement>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [detectionStatus, setDetectionStatus] = useState({
// //     pose: false,
// //     leftHand: false,
// //     rightHand: false,
// //     face: false,
// //   });

// //   useEffect(() => {
// //     let holistic: any;
// //     let animationFrame: number;

// //     const loadScripts = async () => {
// //       try {
// //         // Load drawing utils
// //         await new Promise<void>((resolve, reject) => {
// //           const script = document.createElement("script");
// //           script.src =
// //             "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
// //           script.onload = () => resolve();
// //           script.onerror = reject;
// //           document.body.appendChild(script);
// //         });

// //         // Load holistic
// //         await new Promise<void>((resolve, reject) => {
// //           const script = document.createElement("script");
// //           script.src =
// //             "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
// //           script.onload = () => resolve();
// //           script.onerror = reject;
// //           document.body.appendChild(script);
// //         });

// //         const Holistic = (window as any).Holistic;
// //         const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
// //         const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

// //         holistic = new Holistic({
// //           locateFile: (file: string) =>
// //             `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
// //         });

// //         holistic.setOptions({
// //           modelComplexity: 1,
// //           smoothLandmarks: true,
// //           enableSegmentation: false,
// //           smoothSegmentation: false,
// //           minDetectionConfidence: 0.5,
// //           minTrackingConfidence: 0.5,
// //         });

// //         holistic.onResults((results: any) => {
// //           const canvas = canvasRef.current;
// //           const video = webcamRef.current?.video;
          
// //           if (!canvas || !video) return;

// //           // Set canvas dimensions to match video
// //           if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
// //             canvas.width = video.videoWidth;
// //             canvas.height = video.videoHeight;
// //           }

// //           const ctx = canvas.getContext("2d");
// //           if (!ctx) return;

// //           ctx.save();
// //           ctx.clearRect(0, 0, canvas.width, canvas.height);

// //           // Update detection status
// //           setDetectionStatus({
// //             pose: !!results.poseLandmarks,
// //             leftHand: !!results.leftHandLandmarks,
// //             rightHand: !!results.rightHandLandmarks,
// //             face: false,
// //           });

// //           // Draw pose landmarks
// //           if (results.poseLandmarks && POSE_CONNECTIONS) {
// //             drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
// //               color: "#00FF00",
// //               lineWidth: 4,
// //             });
// //             drawLandmarks(ctx, results.poseLandmarks, {
// //               color: "#FF0000",
// //               fillColor: "#FF0000",
// //               radius: 5,
// //             });
// //           }

// //           // Draw left hand
// //           if (results.leftHandLandmarks && HAND_CONNECTIONS) {
// //             drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
// //               color: "#00FFFF",
// //               lineWidth: 3,
// //             });
// //             drawLandmarks(ctx, results.leftHandLandmarks, {
// //               color: "#0000FF",
// //               fillColor: "#0000FF",
// //               radius: 4,
// //             });
// //           }

// //           // Draw right hand
// //           if (results.rightHandLandmarks && HAND_CONNECTIONS) {
// //             drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
// //               color: "#FFFF00",
// //               lineWidth: 3,
// //             });
// //             drawLandmarks(ctx, results.rightHandLandmarks, {
// //               color: "#FFA500",
// //               fillColor: "#FFA500",
// //               radius: 4,
// //             });
// //           }

// //           ctx.restore();
// //         });

// //         setIsLoading(false);

// //         const sendFrame = async () => {
// //           if (webcamRef.current?.video?.readyState === 4) {
// //             await holistic.send({ image: webcamRef.current.video });
// //           }
// //           animationFrame = requestAnimationFrame(sendFrame);
// //         };
// //         sendFrame();
// //       } catch (error) {
// //         console.error("Error loading MediaPipe:", error);
// //         setIsLoading(false);
// //       }
// //     };

// //     loadScripts();

// //     return () => {
// //       if (animationFrame) {
// //         cancelAnimationFrame(animationFrame);
// //       }
// //       if (holistic) {
// //         holistic.close();
// //       }
// //     };
// //   }, []);

// //   // Helper functions to draw landmarks and connections
// //   const drawLandmarks = (
// //     ctx: CanvasRenderingContext2D,
// //     landmarks: any[],
// //     style: any
// //   ) => {
// //     landmarks.forEach((landmark) => {
// //       ctx.fillStyle = style.fillColor || style.color;
// //       ctx.beginPath();
// //       ctx.arc(
// //         landmark.x * ctx.canvas.width,
// //         landmark.y * ctx.canvas.height,
// //         style.radius || 3,
// //         0,
// //         2 * Math.PI
// //       );
// //       ctx.fill();
// //     });
// //   };

// //   const drawConnectors = (
// //     ctx: CanvasRenderingContext2D,
// //     landmarks: any[],
// //     connections: any[],
// //     style: any
// //   ) => {
// //     if (!connections || !Array.isArray(connections)) return;
    
// //     ctx.strokeStyle = style.color;
// //     ctx.lineWidth = style.lineWidth || 2;

// //     connections.forEach(([start, end]: [number, number]) => {
// //       const startPoint = landmarks[start];
// //       const endPoint = landmarks[end];

// //       if (startPoint && endPoint) {
// //         ctx.beginPath();
// //         ctx.moveTo(
// //           startPoint.x * ctx.canvas.width,
// //           startPoint.y * ctx.canvas.height
// //         );
// //         ctx.lineTo(
// //           endPoint.x * ctx.canvas.width,
// //           endPoint.y * ctx.canvas.height
// //         );
// //         ctx.stroke();
// //       }
// //     });
// //   };

// //   return (
// //     <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
// //       {isLoading && (
// //         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
// //           <div className="text-white text-lg">Loading MediaPipe...</div>
// //         </div>
// //       )}
      
// //       {/* Detection Status Overlay */}
// //       <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-20 font-mono">
// //         <div className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
// //           Pose: {detectionStatus.pose ? "✓" : "✗"}
// //         </div>
// //         <div className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
// //           L-Hand: {detectionStatus.leftHand ? "✓" : "✗"}
// //         </div>
// //         <div className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
// //           R-Hand: {detectionStatus.rightHand ? "✓" : "✗"}
// //         </div>
// //       </div>

// //       <Webcam
// //         ref={webcamRef}
// //         className="absolute top-0 left-0 w-full h-full object-cover"
// //         videoConstraints={{
// //           width: 640,
// //           height: 480,
// //           facingMode: "user",
// //         }}
// //       />
// //       <canvas
// //         ref={canvasRef}
// //         className="absolute top-0 left-0 w-full h-full"
// //         style={{ pointerEvents: "none" }}
// //       />
// //     </div>
// //   );
// // };

// // // Export the WebcamFeed component for use in page.tsx
// // export { WebcamFeed };

// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import Webcam from "react-webcam";

// const WebcamFeed: React.FC = () => {
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [detectionStatus, setDetectionStatus] = useState({
//     pose: false,
//     leftHand: false,
//     rightHand: false,
//     face: false,
//   });

//   useEffect(() => {
//     let holistic: any;
//     let animationFrame: number;
//     let isProcessing = false; // Prevent overlapping processing

//     const loadScripts = async () => {
//       try {
//         // Load drawing utils
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement("script");
//           script.src =
//             "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
//           script.onload = () => resolve();
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });

//         // Load holistic
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement("script");
//           script.src =
//             "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
//           script.onload = () => resolve();
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });

//         const Holistic = (window as any).Holistic;
//         const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
//         const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;

//         holistic = new Holistic({
//           locateFile: (file: string) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
//         });

//         holistic.setOptions({
//           modelComplexity: 2, // Higher complexity for better accuracy
//           smoothLandmarks: true,
//           enableSegmentation: false,
//           smoothSegmentation: false,
//           minDetectionConfidence: 0.7, // Higher threshold for better accuracy
//           minTrackingConfidence: 0.7, // Higher threshold for better tracking
//           refineFaceLandmarks: true, // Enable face mesh refinement
//         });

//         holistic.onResults((results: any) => {
//           const canvas = canvasRef.current;
//           const video = webcamRef.current?.video;
          
//           if (!canvas || !video) return;

//           // Set canvas dimensions to match video
//           if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//           }

//           const ctx = canvas.getContext("2d");
//           if (!ctx) return;

//           ctx.save();
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           // Update detection status
//           setDetectionStatus({
//             pose: !!results.poseLandmarks,
//             leftHand: !!results.leftHandLandmarks,
//             rightHand: !!results.rightHandLandmarks,
//             face: !!results.faceLandmarks,
//           });

//           // Draw pose landmarks
//           if (results.poseLandmarks && POSE_CONNECTIONS) {
//             drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
//               color: "#00FF00",
//               lineWidth: 4,
//             });
//             drawLandmarks(ctx, results.poseLandmarks, {
//               color: "#FF0000",
//               fillColor: "#FF0000",
//               radius: 5,
//             });
//           }

//           // Draw left hand
//           if (results.leftHandLandmarks && HAND_CONNECTIONS) {
//             drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
//               color: "#00FFFF",
//               lineWidth: 3,
//             });
//             drawLandmarks(ctx, results.leftHandLandmarks, {
//               color: "#0000FF",
//               fillColor: "#0000FF",
//               radius: 4,
//             });
//           }

//           // Draw right hand
//           if (results.rightHandLandmarks && HAND_CONNECTIONS) {
//             drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
//               color: "#FFFF00",
//               lineWidth: 3,
//             });
//             drawLandmarks(ctx, results.rightHandLandmarks, {
//               color: "#FFA500",
//               fillColor: "#FFA500",
//               radius: 4,
//             });
//           }

//           ctx.restore();
//         });

//         setIsLoading(false);

//         const sendFrame = async () => {
//           if (webcamRef.current?.video?.readyState === 4 && !isProcessing) {
//             isProcessing = true;
//             await holistic.send({ image: webcamRef.current.video });
//             isProcessing = false;
//           }
//           animationFrame = requestAnimationFrame(sendFrame);
//         };
//         sendFrame();
//       } catch (error) {
//         console.error("Error loading MediaPipe:", error);
//         setIsLoading(false);
//       }
//     };

//     loadScripts();

//     return () => {
//       if (animationFrame) {
//         cancelAnimationFrame(animationFrame);
//       }
//       if (holistic) {
//         holistic.close();
//       }
//     };
//   }, []);

//   // Helper functions to draw landmarks and connections
//   const drawLandmarks = (
//     ctx: CanvasRenderingContext2D,
//     landmarks: any[],
//     style: any
//   ) => {
//     landmarks.forEach((landmark) => {
//       ctx.fillStyle = style.fillColor || style.color;
//       ctx.beginPath();
//       ctx.arc(
//         landmark.x * ctx.canvas.width,
//         landmark.y * ctx.canvas.height,
//         style.radius || 3,
//         0,
//         2 * Math.PI
//       );
//       ctx.fill();
//     });
//   };

//   const drawConnectors = (
//     ctx: CanvasRenderingContext2D,
//     landmarks: any[],
//     connections: any[],
//     style: any
//   ) => {
//     if (!connections || !Array.isArray(connections)) return;
    
//     ctx.strokeStyle = style.color;
//     ctx.lineWidth = style.lineWidth || 2;

//     connections.forEach(([start, end]: [number, number]) => {
//       const startPoint = landmarks[start];
//       const endPoint = landmarks[end];

//       if (startPoint && endPoint) {
//         ctx.beginPath();
//         ctx.moveTo(
//           startPoint.x * ctx.canvas.width,
//           startPoint.y * ctx.canvas.height
//         );
//         ctx.lineTo(
//           endPoint.x * ctx.canvas.width,
//           endPoint.y * ctx.canvas.height
//         );
//         ctx.stroke();
//       }
//     });
//   };

//   return (
//     <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
//           <div className="text-white text-lg">Loading MediaPipe...</div>
//         </div>
//       )}
      
//       {/* Detection Status Overlay */}
//       <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-20 font-mono">
//         <div className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
//           Pose: {detectionStatus.pose ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
//           L-Hand: {detectionStatus.leftHand ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
//           R-Hand: {detectionStatus.rightHand ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.face ? "text-purple-400" : "text-red-400"}>
//           Face: {detectionStatus.face ? "✓" : "✗"}
//         </div>
//       </div>

//       <Webcam
//         ref={webcamRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         videoConstraints={{
//           width: 1280,
//           height: 720,
//           facingMode: "user",
//           frameRate: 30, // Optimize frame rate
//         }}
//       />
//       <canvas
//         ref={canvasRef}
//         className="absolute top-0 left-0 w-full h-full"
//         style={{ pointerEvents: "none" }}
//       />
//     </div>
//   );
// };

// // Export the WebcamFeed component for use in page.tsx
// export { WebcamFeed };
// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import Webcam from "react-webcam";

// const WebcamFeed: React.FC = () => {
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [detectionStatus, setDetectionStatus] = useState({
//     pose: false,
//     leftHand: false,
//     rightHand: false,
//     face: false,
//   });
//   const [fps, setFps] = useState(0);
//   const lastFrameTimeRef = useRef(Date.now());
//   const frameCountRef = useRef(0);

//   useEffect(() => {
//     let holistic: any;
//     let animationFrame: number;
//     let isProcessing = false;
//     let lastSendTime = 0;
//     const minFrameInterval = 1000 / 30; // Target 30 FPS max

//     const loadScripts = async () => {
//       try {
//         // Load drawing utils
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement("script");
//           script.src =
//             "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
//           script.onload = () => resolve();
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });

//         // Load holistic
//         await new Promise<void>((resolve, reject) => {
//           const script = document.createElement("script");
//           script.src =
//             "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js";
//           script.onload = () => resolve();
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });

//         const Holistic = (window as any).Holistic;
//         const POSE_CONNECTIONS = (window as any).POSE_CONNECTIONS;
//         const HAND_CONNECTIONS = (window as any).HAND_CONNECTIONS;
//         const FACEMESH_TESSELATION = (window as any).FACEMESH_TESSELATION;

//         holistic = new Holistic({
//           locateFile: (file: string) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
//         });

//         holistic.setOptions({
//           modelComplexity: 1, // Reduced for lower latency
//           smoothLandmarks: false, // Disabled for instant response
//           enableSegmentation: false,
//           smoothSegmentation: false,
//           minDetectionConfidence: 0.5, // Balanced for speed
//           minTrackingConfidence: 0.5,
//           refineFaceLandmarks: false, // Disabled for speed
//         });

//         holistic.onResults((results: any) => {
//           const canvas = canvasRef.current;
//           const video = webcamRef.current?.video;
          
//           if (!canvas || !video) return;

//           // Calculate FPS
//           frameCountRef.current++;
//           const now = Date.now();
//           if (now - lastFrameTimeRef.current >= 1000) {
//             setFps(frameCountRef.current);
//             frameCountRef.current = 0;
//             lastFrameTimeRef.current = now;
//           }

//           // Set canvas dimensions to match video
//           if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//           }

//           const ctx = canvas.getContext("2d", { 
//             alpha: true,
//             desynchronized: true // Reduce latency
//           });
//           if (!ctx) return;

//           ctx.save();
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           // Update detection status
//           setDetectionStatus({
//             pose: !!results.poseLandmarks,
//             leftHand: !!results.leftHandLandmarks,
//             rightHand: !!results.rightHandLandmarks,
//             face: !!results.faceLandmarks,
//           });

//           // Draw pose landmarks
//           if (results.poseLandmarks && POSE_CONNECTIONS) {
//             drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
//               color: "#00FF00",
//               lineWidth: 3,
//             });
//             drawLandmarks(ctx, results.poseLandmarks, {
//               color: "#FF0000",
//               fillColor: "#FF0000",
//               radius: 4,
//             });
//           }

//           // Draw left hand
//           if (results.leftHandLandmarks && HAND_CONNECTIONS) {
//             drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
//               color: "#00FFFF",
//               lineWidth: 2,
//             });
//             drawLandmarks(ctx, results.leftHandLandmarks, {
//               color: "#0000FF",
//               fillColor: "#0000FF",
//               radius: 3,
//             });
//           }

//           // Draw right hand
//           if (results.rightHandLandmarks && HAND_CONNECTIONS) {
//             drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
//               color: "#FFFF00",
//               lineWidth: 2,
//             });
//             drawLandmarks(ctx, results.rightHandLandmarks, {
//               color: "#FFA500",
//               fillColor: "#FFA500",
//               radius: 3,
//             });
//           }

//           // Draw face mesh (lighter version)
//           if (results.faceLandmarks && FACEMESH_TESSELATION) {
//             drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
//               color: "#C0C0C070",
//               lineWidth: 1,
//             });
//           }

//           ctx.restore();
//           isProcessing = false;
//         });

//         setIsLoading(false);

//         const sendFrame = () => {
//           const now = performance.now();
          
//           if (
//             webcamRef.current?.video?.readyState === 4 && 
//             !isProcessing &&
//             now - lastSendTime >= minFrameInterval
//           ) {
//             isProcessing = true;
//             lastSendTime = now;
//             holistic.send({ image: webcamRef.current.video });
//           }
          
//           animationFrame = requestAnimationFrame(sendFrame);
//         };
//         sendFrame();
//       } catch (error) {
//         console.error("Error loading MediaPipe:", error);
//         setIsLoading(false);
//       }
//     };

//     loadScripts();

//     return () => {
//       if (animationFrame) {
//         cancelAnimationFrame(animationFrame);
//       }
//       if (holistic) {
//         holistic.close();
//       }
//     };
//   }, []);

//   // Helper functions to draw landmarks and connections
//   const drawLandmarks = (
//     ctx: CanvasRenderingContext2D,
//     landmarks: any[],
//     style: any
//   ) => {
//     ctx.fillStyle = style.fillColor || style.color;
//     landmarks.forEach((landmark) => {
//       ctx.beginPath();
//       ctx.arc(
//         landmark.x * ctx.canvas.width,
//         landmark.y * ctx.canvas.height,
//         style.radius || 3,
//         0,
//         2 * Math.PI
//       );
//       ctx.fill();
//     });
//   };

//   const drawConnectors = (
//     ctx: CanvasRenderingContext2D,
//     landmarks: any[],
//     connections: any[],
//     style: any
//   ) => {
//     if (!connections || !Array.isArray(connections)) return;
    
//     ctx.strokeStyle = style.color;
//     ctx.lineWidth = style.lineWidth || 2;
//     ctx.beginPath();

//     connections.forEach(([start, end]: [number, number]) => {
//       const startPoint = landmarks[start];
//       const endPoint = landmarks[end];

//       if (startPoint && endPoint) {
//         ctx.moveTo(
//           startPoint.x * ctx.canvas.width,
//           startPoint.y * ctx.canvas.height
//         );
//         ctx.lineTo(
//           endPoint.x * ctx.canvas.width,
//           endPoint.y * ctx.canvas.height
//         );
//       }
//     });
    
//     ctx.stroke();
//   };

//   return (
//     <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
//           <div className="text-white text-lg">Loading MediaPipe...</div>
//         </div>
//       )}
      
//       {/* Detection Status Overlay */}
//       <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-20 font-mono">
//         <div className="text-blue-400 mb-1">FPS: {fps}</div>
//         <div className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
//           Pose: {detectionStatus.pose ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
//           L-Hand: {detectionStatus.leftHand ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
//           R-Hand: {detectionStatus.rightHand ? "✓" : "✗"}
//         </div>
//         <div className={detectionStatus.face ? "text-purple-400" : "text-red-400"}>
//           Face: {detectionStatus.face ? "✓" : "✗"}
//         </div>
//       </div>

//       <Webcam
//         ref={webcamRef}
//         className="absolute top-0 left-0 w-full h-full object-cover"
//         videoConstraints={{
//           width: 640,
//           height: 480,
//           facingMode: "user",
//           frameRate: { ideal: 30, max: 30 },
//         }}
//         mirrored={true}
//       />
//       <canvas
//         ref={canvasRef}
//         className="absolute top-0 left-0 w-full h-full"
//         style={{ pointerEvents: "none" }}
//       />
//     </div>
//   );
// };

// // Export the WebcamFeed component for use in page.tsx
// export { WebcamFeed };
"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const WebcamFeed: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fps, setFps] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState({
    pose: false,
    leftHand: false,
    rightHand: false,
    face: false,
  });

  useEffect(() => {
    let holistic: any;
    let animationFrame: number;
    let lastFrameTime = 0;
    let frameCount = 0;
    let fpsUpdateTime = performance.now();
    const targetFPS = 30; // Limit to 30 FPS for better performance
    const frameInterval = 1000 / targetFPS;

    const loadScripts = async () => {
      try {
        // Load drawing utils
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
          script.onload = () => resolve();
          script.onerror = reject;
          document.body.appendChild(script);
        });

        // Load holistic
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

          // Calculate FPS
          frameCount++;
          const now = performance.now();
          if (now - fpsUpdateTime >= 1000) {
            setFps(frameCount);
            frameCount = 0;
            fpsUpdateTime = now;
          }

          // Set canvas dimensions to match video
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update detection status
          setDetectionStatus({
            pose: !!results.poseLandmarks,
            leftHand: !!results.leftHandLandmarks,
            rightHand: !!results.rightHandLandmarks,
            face: false,
          });

          // Draw pose landmarks
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

          // Draw left hand
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

          // Draw right hand
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
          // Throttle to target FPS
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
  }, []);

  // Helper functions to draw landmarks and connections
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

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-white text-lg">Loading MediaPipe...</div>
        </div>
      )}
      
      {/* Detection Status Overlay */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded z-20 font-mono">
        <div className="text-white mb-1">FPS: {fps}</div>
        <div className={detectionStatus.pose ? "text-green-400" : "text-red-400"}>
          Pose: {detectionStatus.pose ? "✓" : "✗"}
        </div>
        <div className={detectionStatus.leftHand ? "text-cyan-400" : "text-red-400"}>
          L-Hand: {detectionStatus.leftHand ? "✓" : "✗"}
        </div>
        <div className={detectionStatus.rightHand ? "text-yellow-400" : "text-red-400"}>
          R-Hand: {detectionStatus.rightHand ? "✓" : "✗"}
        </div>
      </div>

      <Webcam
        ref={webcamRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        videoConstraints={{
          width: 1280,
          height: 720,
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
  );
};

// Export the WebcamFeed component for use in page.tsx
export { WebcamFeed };