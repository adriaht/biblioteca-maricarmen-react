
function Paragraph  ({ children, ...others }) {
    return <p {...others}>{children}</p>;
  };
  
  export default Paragraph;