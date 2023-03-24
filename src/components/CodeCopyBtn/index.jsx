import { Typography } from "antd";
import React, { memo } from "react";

import "./index.less";
function CodeCopyBtn({ children }) {
  

  return (
    <div className="code-copy">
      <div className="code-copy-btn">
      <Typography.Text copyable={{ 
        //icon: [<SmileOutlined key="copy-icon" />, <SmileFilled key="copied-icon" />],
        text: children[0].props.children[0] }}></Typography.Text>
      </div>
    </div>
  );
}

export default memo(CodeCopyBtn);

