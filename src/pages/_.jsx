import { useRef, useState } from 'react'
import { ProFormTextArea, ProFormDependency, ProFormFieldSet, QueryFilter, ProForm, ProFormSelect, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import './index.less'
import { Image, Select, Input, Button ,Spin,message, Divider, Form} from 'antd';
import { SendOutlined, QuestionCircleOutlined, AudioOutlined ,RedditOutlined} from '@ant-design/icons';
import AutoTextArea from '@/components/Textarea/index';
function App() {
  const [inputValue, setInputValue] = useState("")
	const [answerList, setAnswerList] = useState([])
  const [type, setType] = useState('text');
	const preItem = useRef(null)
  const [formRef] = Form.useForm();
	const [messageApi,contextHolder] = message.useMessage();


	const quize = (values)=>{
		setAnswerList([...answerList,{
			type:'question',
			content:values.q,
			isFinshed: 1,
		},{
			type: 'answer',
			content: '正在思考',
			isFinshed: 0,
		}])
    formRef.setFieldsValue({q:''});
		getMessage(values)
	}

	const getMessage = async (values)=>{
    const data = {
      q: values.q,
      t: values.type,
    };
    if(values.type === 'image') {
      data.n = values.n ? parseInt(values.n) : 1;
      if(values.width && values.height) {
        data.size = `${values.width}x${values.height}`;
      }
    }

		fetch('http://chatapi.cfyhome.com:7001/api/openai?q='+data.q+'&t=' + data.t, {
      method: 'GET',
       headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      //body: JSON.stringify(data),
    }).then(async (response )=>{
      const reader = response.body.getReader();
        console.log(reader);
        for await (const chunk of readChunks(reader)) {
            console.log(`received chunk of size ${chunk.length}`);
        }
			// 打印 API 返回的结果
      const data = await response.json();
      console.log(data)
			setAnswerList(answerList=>answerList.map((item,index)=>{
					if(index < answerList.length-1){
						return item
					}else{
            let content;
            if(values.type === 'text') {
              content = data?.data?.[0]?.message?.content?.replace(/\n{2}/, " ");
            }
            if(values.type === 'image') {
              content = data?.data || [];
            }
						return {
							type: values.type,
              content,
							isFinshed: 1,
						}
					}
				}))
		}).catch((e)=>{
			messageApi.open({
				type: 'error',
				content: e.message,
			  });
		})
	}

  return (
    <div className="App">
		{contextHolder}
		<div className='answer_box'>
			<div className='answer'>{
				answerList.map((item,index)=>{
					if(item.type==='question'){
						// 问题
						return (
							<div className='item' key={index}>
								<div><QuestionCircleOutlined  style={{fontSize:'24px',color:'#646cffaa'}}/> </div>
								<span className='span'>{item.content}</span>
							</div>
						)
					}else{
						// 回答
						if(item.isFinshed === 0){
							// 加载中
							return (
								<div className='item' ref={preItem} key={index}>
									<div><RedditOutlined style={{fontSize:'24px',color:'#42b883aa'}}/> </div>
									<span className='span'><Spin /></span>
								</div>
							)
						}else if(item.type === 'text'){
							// 回复答案
							return (
								<div className='item' key={index}>
									<div><RedditOutlined style={{fontSize:'24px',color:'#42b883aa'}}/> </div> 
									<span className='span'>{item.content}</span>
								</div>
							)
						} else if(item.type === 'image') {
              return (
                <div className='item' key={index}>
                  <div><RedditOutlined style={{fontSize:'24px',color:'#42b883aa'}}/> </div>
                  <span className='span' style={{display:'flex', gap: 8}}>
                  <Image.PreviewGroup
                      preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                    >
                  {item.content.map(image => {
                    return <Image width={200} src={image.url} />
                  })}
                  </Image.PreviewGroup>
                  </span>
                </div>
               )
            }
					}
				})
			}</div>
		</div>
    <div className='input'>
      <ProForm initialValues={{type: 'text', n: 1, width: 1024, height: 1024}} form={formRef} submitter={{
        searchConfig: {
          submitText: '提问',
        },
        render: (props, doms) => {
          return null;
        }
      }}
      onFinish={quize}
      >
        <ProForm.Group>
        <ProFormSelect
          options={[{label: "文本对话", value: "text"}, {label: "AI图片", value: "image"}]}
          name="type"
          label={"类型"}
          rules={[{required: true}]}
        />
        <ProFormDependency name={['type']}>
          {({ type }) => {
            if(type === 'image') {
              return <div style={{display:'flex', gap: 8}}>
                <ProFormDigit name="n" label="图片数量" min={1} max={9} />
                <ProFormDigit name="width" label="图片宽(像素)" min={100} max={1920} />
                <ProFormDigit name="height" label="图片高(像素)" min={100} max={1920}/>
               </div>
            }
            return null;
          }}
        </ProFormDependency>
        </ProForm.Group>
        <Form.Item name="q" label="问题" rules={[{required: true}]}>
          <AutoTextArea onClick={()=>formRef.submit()} formRef={formRef}/>
        </Form.Item>
      </ProForm>
    </div>
    </div>
  )
}

export default App
