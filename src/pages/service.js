import Uint8ArrayToStringsTransformer from "../utils/Uint8ArrayToStringsTransformer";
import JSON5 from 'json5';
export const api = async (value, answerList, props) => {
  const {doneFn, lineFn} = props;
  console.log(value, doneFn, lineFn)
  const ts = new TransformStream(new Uint8ArrayToStringsTransformer());
  const response = await fetch('http://chatapi.cfyhome.com/api/openai', {
    method: "POST",
    body: JSON.stringify({
      prompt: value,
    }),
    headers: {
      "content-type": "application/json",
    },
    mode: "cors",
    credentials: "include"
  });
  const rs = response?.body || response?._bodyBlob?.stream();
  const lineStream = rs?.pipeThrough(ts);
  const reader = lineStream?.getReader();
  while (true) {
    const { done, value } = await reader.read();
    let newValue = value ? JSON.parse(JSON.stringify(value)).substr(6) : "";
    if (newValue == "[DONE]") {
      doneFn();
      return;
    }
    let content = "";
    try {
      content = newValue ? JSON5.parse(newValue)?.choices?.[0]?.delta?.content : "";
    } catch {
      continue;
    }
    if (done) {
      doneFn();
      break;
    }
    //当content为空的时候跳出当前循环
    if (
      content !== 0 &&
      content !== "0" &&
      content !== "false" &&
      content !== false &&
      !content
    ) {
      continue;
    }
    if(!answerList[answerList.length - 1].text) {
      answerList[answerList.length - 1].text = "";
    }
    answerList[answerList.length - 1].text += content;
    lineFn(answerList);
  }
}
