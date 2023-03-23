import { useEffect } from "react";
import Uint8ArrayToStringsTransformer from './Uint8ArrayToStringsTransformer';
export default () => {
	const api = async (value, array) => {
		const ts = new TransformStream(new Uint8ArrayToStringsTransformer());
		const response = await fetch('http://chatapi.cfyhome.com/api/openai', {
			// const response = await fetch('http://api.cfyhome.com:7001/api/openai', {
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
			console.log(done, value)
      if (done) {
				break;
      }
    }
	}
	
	useEffect(() => {
		api("eggjs实现eventStream");
	}, [])
	return null;
}