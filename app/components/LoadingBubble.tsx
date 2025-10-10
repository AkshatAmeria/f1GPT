// const LoadingBubble = () => {
// return (
//     <div className="loader">
//     </div>
// )
// }

// export default LoadingBubble

const LoadingBubble = () => {
  return (
    <div className="loader-wrapper">
      <div className="loading-text">Analyzing telemetry data...</div>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingBubble;
