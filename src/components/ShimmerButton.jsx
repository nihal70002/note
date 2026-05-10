const ShimmerButton = ({ children, loading, disabled, className = '', ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        relative overflow-hidden transition-all duration-300
        ${loading ? 'cursor-not-allowed' : ''}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {children}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-ink/20 rounded-full animate-pulse"></div>
            <div className="w-1 h-4 bg-ink/20 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-4 bg-ink/20 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      )}
    </button>
  );
};

export default ShimmerButton;
