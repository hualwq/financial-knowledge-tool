<template>
    <div>
      <el-form>
        <el-form-item>
            <el-input v-model="inputText" placeholder="请输入公司名称" />
        </el-form-item>
        
      </el-form>
      
      <el-button
            type="primary"
            :disabled="!isButtonEnabled"
            @click="sendData">查询
          </el-button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        inputText: ''
      };
    },
    computed: {
    isButtonEnabled() {
      return this.inputText.trim() !== '';
    }
  },
    methods: {
        async sendData() {
    try {
      const response = await axios.post('http://10.176.22.62:8001/fuzzymatch/', this.inputText, {
        headers: {
          'Content-Type': 'application/json', // 指定请求体为 JSON 格式
        },
        responseType: 'blob', // 重要，指明返回类型为 Blob
      });

      // 创建一个链接元素
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'companies.xlsx'); // 文件名

      // 触发下载
      document.body.appendChild(link);
      link.click(); 

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载文件失败:', error);
    }
  },
  },
  };
  </script>
  
  <style scoped>
  /* 可以添加一些样式 */
  </style>
  