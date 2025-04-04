

function Header ({ level, children, ...others })  {
  const Tag = `h${level}`;
  return <Tag {...others}>{children}</Tag>;
};

export default Header;