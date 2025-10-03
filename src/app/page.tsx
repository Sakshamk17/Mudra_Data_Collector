// import DatasetCollector from "@/components/DatasetCollector";
// import { WebcamFeed } from "@/components/WebcamFeed";

// export default function Home() {
//   return (
//     <div className="w-screen h-screen bg-gray-900 flex items-center justify-center overflow-hidden">
//       <div className="w-[640px] h-[480px] relative">
//         {/* <WebcamFeed /> */}
//         <DatasetCollector/>
//       </div>
//     </div>
//   );
// }
import DatasetCollector from "@/components/DatasetCollector";

export default function Home() {
  return <DatasetCollector />;
}