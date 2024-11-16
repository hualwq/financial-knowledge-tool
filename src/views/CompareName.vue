<template>
    <el-container>
      <el-header>
        <h2>上传 Excel 文件</h2>
      </el-header>
      <el-main>
        <el-form>
          <el-form-item>
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              action="/your/api/endpoint"
              :on-change="onFileChange"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot:tip>只能上传 .xlsx 或 .xls 文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="uploadFile" :disabled="!selectedFile">对比</el-button>
          </el-form-item>
        </el-form>
        <el-image :src="require('../assets/compare_name.png')"></el-image>
      </el-main>
    </el-container>
  </template>
  
  <script>
  import { ElUpload, ElButton, ElForm, ElFormItem } from 'element-plus';
  import axios from 'axios';
  
  export default {
    components: {
      ElUpload,
      ElButton,
      ElForm,
      ElFormItem,
    },
    data() {
      return {
        selectedFile: null,
      };
    },
    methods: {
      onFileChange(file) {
        this.selectedFile = file.raw; // 获取原始文件
        this.$message.success('文件上传成功！')
      },
      beforeUpload(file) {
        const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                        file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
          this.$message.error('只能上传 Excel 文件！');
        }
        return isExcel; // 返回 false 以阻止上传
      },
      async uploadFile() {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        try {
  const response = await axios.post('http://10.176.22.62:8001/comparename/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',  // 确保响应类型为二进制数据，以便处理文件
  });

  const contentType = response.headers['content-type'];
  if (contentType === 'application/json') {
    // JSON 响应
    const responseData = await response.data;
    if (responseData.status === 'success') {
      console.log("返回成功");
      if (responseData.message === 'All nodes added successfully') {
        console.log("断点1");
        alert(responseData.message);
      } else if (responseData.message === 'Some nodes were not added') {
        console.log("断点2");
        alert(responseData.message);
      }
    }
  } else if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    // Blob 响应，下载文件
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '对比结果.xlsx';
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }
} catch (error) {
  console.error(error);
  this.$message.error('节点上传失败！');
}

      },
    },
  };
  </script>
  
  <style scoped>
  .upload-demo {
    margin-bottom: 16px;
  }
  </style>
  