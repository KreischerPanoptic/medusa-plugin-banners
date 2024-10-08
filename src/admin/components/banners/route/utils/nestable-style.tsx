const NestableCategoriesStyle = () => {
  return (
    <style>
      {`
        .nestable-item.is-dragging:before {
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
        
          transition: 0.3s all;
        
          border-radius: 0;
          border: 1px dashed #6e56cf;
          z-index: 1000;
        }
        
        .nestable-item.is-dragging * {
          height: 40px !important;
          min-height: 40px !important;
          max-height: 40px !important;
        }
				`}
    </style>
  );
};

export default NestableCategoriesStyle;
