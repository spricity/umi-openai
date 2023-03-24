import React, { useEffect, lazy, Suspense, memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import stringWidth from "string-width";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { UserOutlined } from '@ant-design/icons';
import {
  tomorrow,
  vscDarkPlus,
  coyWithoutShadows,
  darcula,
  a11yDark,
  dark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeCopyBtn from "../CodeCopyBtn";
import "./index.less";
import { Avatar, Typography } from "antd";
function ChatBox(props) {
  const { answerList, isShowImg, prohibit, onSubmit} = props;
  let clearNull;
  const fun = () => {
    let ele = document.querySelector(".ChatBox-contents");
    //判断元素是否出现了滚动条
    if (ele.scrollHeight > ele.clientHeight) {
      clearNull = setTimeout(() => {
        //设置滚动条到最底部
        ele.scrollTop = ele.scrollHeight;
        ele.style.opacity = 1;
      }, 500);
    } else {
      ele.style.opacity = 1;
    }
  };
  const Pre = ({ children }) => (
    <pre className="blog-pre">
      <Suspense fallback={<div>loading...</div>}>
        <CodeCopyBtn>{children}</CodeCopyBtn>
        {/* <Typography.Text copyable={{ text: children[0].props.children[0] }}></Typography.Text> */}
      </Suspense>
      {children}
    </pre>
  );
  useEffect(() => {
    fun();
    return () => {
      clearTimeout(clearNull);
    };
  }, [
    document.querySelector(".ChatBox-contents")?.scrollHeight,
    answerList?.length,
  ]);
  return (
    <div className="ChatBox">
      <div className="ChatBox-contents">
        {(answerList || []).map((item, index) => (
            <div key={JSON.stringify(index)} className="ChatBox-contents-inner">
              <div
                className="ChatBox-contents-inner-box"
                id={item?.id ? "" : "innerStyle"}
              >
                <div className="ChatBox-contents-inner-box-logo">
                  <Avatar size={32} icon={<UserOutlined />} src={item?.id ?  "https://img.alicdn.com/imgextra/i3/O1CN01PWSks31iDdBe1GK0d_!!6000000004379-2-tps-200-200.png" : null}/>
                </div>
                <div
                  className={
                    item?.id && isShowImg && answerList?.length - 1 == index
                      ? "ChatBox-contents-inner-box-text reactMarkdownIds"
                      : "ChatBox-contents-inner-box-text"
                  }
                  id={item?.id ? "textStyle" : ""}
                >
                  {item?.id && <div className="ChatGPTRobot">ChatGPT</div>}
                  {!item?.text && <div className="example" />}
                  {item?.id ? (
                    <ReactMarkdown
                      key={JSON.parse(JSON.stringify(index))}
                      children={item?.text}
                      // children={ceshi14}
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[
                        remarkGfm,
                        {
                          singleTilde: false,
                          tableCellPadding: true,
                          tablePipeAlign: true,
                          stringLength: stringWidth,
                        },
                      ]}
                      components={{
                        pre: Pre,
                        code({
                          node,
                          inline,
                          className = "blog-code",
                          children,
                          ...props
                        }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              showLineNumbers={true}
                              linkTarget="_blank"
                              // style={dark}
                              language={match[1] || "java"}
                              PreTag="div"
                              children={String(children).replace(/\n$/, "")}
                              // wrapLongLines={true}
                              wrapLines={true}
                              // useInlineStyles={false}
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  ) : (
                    item?.text
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {!prohibit && (
        <div className="ChatBox-children1">
          <div className="ChatBox-children1-innerbox">
            <div className="onceMore" onClick={() => onSubmit(true)}>
              <div className="onceMoreImgs" />再来一次
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ChatBox);
