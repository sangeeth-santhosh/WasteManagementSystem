const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    verified: 'bg-blue-100 text-blue-800 border-blue-200',
    collected: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;




