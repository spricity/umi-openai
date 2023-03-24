import { useEffect, useState, useRef, useMemo } from "react";
import ChatBox from "@/components/ChatBox";
import "./index.less";
import { Form, Input } from "antd";
import { api } from './service';
export default function Home() {
  const [question, setQuestion] = useState("");
  const [answerList, setAnswerList] = useState([]); //聊天框数据
  const [isProhibit, setIsProhibit] = useState(false); //是否允许提交
  const [isShowImg, setIsShowImg] = useState(true); //文字动态img
  const [inputValue, setInputValue] = useState("");

  const ref = useRef(null);
  const updateLine = (newAnswerList) => {
    setAnswerList([...newAnswerList]);
  }
  const updateError = (error) => {
    const newAnswerList = [...answerList];
    newAnswerList[newAnswerList.length - 1].text = error;
    setAnswerList(newAnswerList);
  }
  const toggleDisabled = (flag) => {
    setIsShowImg(flag);
    // true:禁止提交, false：允许提交
    setIsProhibit(flag);
  }
  //点击提交的时候
  const onSubmit = (again) => {
    if (isProhibit) return;
    const value = inputValue;
    if ((value?.replace(/(^\s*)|(\s*$)/g, "") == "" || !value) && !again) return;
    // 存储value
    !again && setQuestion(value);
    toggleDisabled(true);
    const currentQuestion = again ? question : value;
    const newAnswerList = [...answerList];
    again ? newAnswerList.push({id: true}) : newAnswerList.push({text: value}, {id: true});
    setAnswerList(newAnswerList);
    //调取api
    api(currentQuestion, newAnswerList, {
      doneFn: () => toggleDisabled(false),
      lineFn: updateLine
    }).catch((err) => {
      updateError(String(err) || "出错了")
      toggleDisabled(false);
    });
    // 清除input的值
    setInputValue("");
  };
  //点击键盘回车的发送
  const onkeydowns = function (ev) {
    ev = ev || window.event;
    if (ev.keyCode == 13) {
      //textarea按下回车发送消息，textarea按下回车不换行
      ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
    }
  };
  useEffect(() => {
    ref.current?.focus();
  }, []);
  //img显示状态
  const fnImgSrc = () => {
    return isProhibit 
      ? "https://img.alicdn.com/imgextra/i4/O1CN01BS5uSs22u2AjtpGFl_!!6000000007179-2-tps-24-24.png" //loading回答中;
      : "https://img.alicdn.com/imgextra/i4/O1CN01zlvoXu1o9rd2FpSfJ_!!6000000005183-2-tps-48-48.png"; //编辑中
  };
  //返回首页
  const callBackClick = () => {
    setIsProhibit(false);
    setIsShowImg(true);
    setQuestion("");
    setAnswerList([]);
  };
  //ChatBox优化
  const answerListMemo = useMemo(() => answerList, [answerList]);
  const isShowImgMemo = useMemo(() => isShowImg, [isShowImg]);
  const isProhibitMemo = useMemo(() => isProhibit, [isProhibit]);
  const onSubmitMemo = useMemo(() => onSubmit, [isProhibit, answerList]);
  return (
    <div className={answerList?.length > 0  ? "idea-talk-box styleBox" : "idea-talk-box"}
      style={{ background:"url('https://img.alicdn.com/imgextra/i3/O1CN01CKuAgv1jWEtktC1qo_!!6000000004555-0-tps-2880-1620.jpg')"}}
    >
      <div className={answerList?.length > 0  ? "idea-talk-box-ideatalk idea-talk-box-ideatalks" : "idea-talk-box-ideatalk"}>
        {answerList?.length > 0 && (
          <img src="https://img.alicdn.com/imgextra/i1/O1CN019JZ3A91bN42JgtkZz_!!6000000003452-2-tps-48-48.png" className="idea-talk-box-ideatalk-imgs" onClick={() => callBackClick()}/>
        )}
        chatGPT-3.5
      </div>
      <div className={answerList?.length > 0 ? "idea-talk-box-outerLayer outerLayerIsHeight" : "idea-talk-box-outerLayer"}>
        <div className="idea-talk-box-outerLayer-smallbox">
          {answerList?.length > 0 && (
            /* 聊天内容区域 */
            <div className="idea-talk-box-content">
              <ChatBox
                answerList={answerListMemo}
                isShowImg={isShowImgMemo}
                prohibit={isProhibitMemo}
                onSubmit={onSubmitMemo}
              />
            </div>
          )}

          {/* 输入区域 */}
          <Form style={{width: "100%"}}>
            <Form.Item>
              <div className="idea-talk-box-bigBox">
                <div className={answerList?.length > 0 ? "idea-talk-box-bigBox-input inputStyle" : "idea-talk-box-bigBox-input"}>
                  <div className="OptionsMenuBox">
                    <img src="https://img.alicdn.com/imgextra/i3/O1CN01PWSks31iDdBe1GK0d_!!6000000004379-2-tps-200-200.png" className="inputIcon"/>
                  </div>
                  <Input.TextArea
                    name="inputValue"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className="typing"
                    ref={ref}
                    placeholder="请输入问题"
                    size="large"
                    value={inputValue}
                    onKeyDown={onkeydowns}
                    onPressEnter={() => onSubmit()}
                    onChange={(e) => setInputValue(e.target.value.trim())}
                    bordered={false}
                  />
                  <img src={fnImgSrc()} alt="" className={isProhibit ? "svgImg isShowSvgImg" : "svgImg"} onClick={() => onSubmit()}/>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}


