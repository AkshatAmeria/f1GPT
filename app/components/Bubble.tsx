// const Bubble = ({message}) => {

//     const {role, content} = message

// return (
//     <div className={`${role} bubble`}>
//         {content}
//     </div>
// )
// }

// export default Bubble

const Bubble = ({ message }) => {
  const { role, content } = message;

  return (
    <div className={`bubble ${role}`}>
      <div className="bubble-content">
        {role === "assistant" && <span className="pit-icon">🏁</span>}
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Bubble;
``
