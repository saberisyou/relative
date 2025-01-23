import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import {Cell, Button,Toast,Input,Field,Form} from "@taroify/core"
import { ChatOutlined } from "@taroify/icons"
import './index.scss'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <BasicForm />
    </View>
  )
}
function BasicForm() {
  const onSubmit = (event: any) => {
    Toast.open(JSON.stringify(event.detail.value))
  }

  return (
    <Form onSubmit={onSubmit}>
      <Toast id="toast" />
      <Cell.Group inset>
        <Form.Item name="username" rules={[{ required: true, message: "请填写用户名" }]}>
          <Form.Label>用户名</Form.Label>
          <Form.Control>
            <Input placeholder="用户名" />
          </Form.Control>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "请填写密码" }]}>
          <Form.Label>密码</Form.Label>
          <Form.Control>
            <Input password placeholder="密码" />
          </Form.Control>
        </Form.Item>
        <Field
          name="text"
          label={{ align: "left", children: "文本" }}
          rules={[{ required: true, message: "请填写文本" }]}
        >
          <Input placeholder="请输入文本" />
        </Field>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交1
        </Button>
      </View>
    </Form>
  )
}
