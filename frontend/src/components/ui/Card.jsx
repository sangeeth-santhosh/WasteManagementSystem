const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = 'bg-white border border-gray-200 rounded-xl shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-150' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;





