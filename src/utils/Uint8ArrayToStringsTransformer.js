export default class Uint8ArrayToStringsTransformer {
	constructor() {
		this.decoder = new TextDecoder();
		this.lastString = "";
	}
	transform(chunk, controller) {
		const string = `${this.lastString}${this.decoder.decode(chunk)}`;
		const lines = string.split(/\r\n|[\r\n]/g);
		this.lastString = lines.pop() || "";
		for (const line of lines) {
			controller.enqueue(line);
		}
	}
	flush(controller) {
		if (this.lastString) {
			controller.enqueue(this.lastString);
		}
	}
}