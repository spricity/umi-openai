import { Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './style.less';
export default (props) => {
  const { onChange, value, onClick, formRef, id } = props;
  const errors =  formRef?.getFieldError(id) || [];
  return <div className={`auto-textarea ${errors.length > 0 ? 'auto-textarea-error' : ''}`} style={{display:"flex", alignItems: "flex-end", gap: 4}}>
    <Input.TextArea autoSize onChange={onChange} value={value} />
    <div className="submit" onClick={onClick}><SendOutlined /></div>
  </div>
}
