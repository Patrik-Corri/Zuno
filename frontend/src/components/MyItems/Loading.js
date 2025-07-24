

const Loading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex space-x-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full animate-pulse"
          style={{
            backgroundColor: '#be185d',
            animationDelay: `${i * 200}ms`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
      </div>
  </div>
);

export default Loading;