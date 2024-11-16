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
          <el-input v-model="relationship_name" placeholder="请输入关系名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="uploadFile" :disabled="!selectedFile">确认添加</el-button>
        </el-form-item>
        <!-- 查询进度条 -->
        <el-progress :percentage="progress" />
      </el-form>
      <el-image :src="require('../assets/relationship_excel_law.png')" />
    </el-main>
  </el-container>
</template>

<script>
import { ElUpload, ElButton, ElForm, ElFormItem, ElProgress } from 'element-plus';
import axios from 'axios';

export default {
  components: {
    ElUpload,
    ElButton,
    ElForm,
    ElFormItem,
    ElProgress,  // 引入进度条组件
  },
  data() {
    return {
      selectedFile: null,
      relationship_name: null,
      progress: 0, // 上传进度
      intervalId: null,  // 用于控制进度轮询
    };
  },
  methods: {
    onFileChange(file) {
      this.selectedFile = file.raw; // 获取原始文件
      this.$message.success('文件添加成功！');
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
      formData.append('relationship_name', this.relationship_name);
      formData.append('file', this.selectedFile);

      try {
        // 发送上传请求
        const uploadResponse = await axios.post('http://10.176.22.62:8001/addrelationshipexcel/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // 如果上传成功，开始查询进度
        if (uploadResponse.data.status === 'success') {
          this.$message.success('文件上传成功，开始处理...');
          this.startPolling();  // 开始轮询查询进度
        } else {
          this.$message.error(uploadResponse.data.message);
        }
      } catch (error) {
        console.error('上传失败:', error);
        this.$message.error('文件上传失败！');
      }
    },

    // 启动轮询查询任务进度
    startPolling() {
  let lastProgress = null;  // 用来记录上一次的进度值
  let sameCount = 0;        // 用来记录连续相同的进度次数

  this.intervalId = setInterval(() => {
    axios
      .get('http://10.176.22.62:8001/getprogress/')
      .then((response) => {
        this.progress = response.data.progress;

        // 如果进度和上次一样，增加相同次数
        if (this.progress === lastProgress) {
          sameCount++;
        } else {
          sameCount = 0;  // 如果进度不同，重置计数器
        }

        // 如果连续50次进度相同，停止轮询
        if (sameCount >= 50) {
          clearInterval(this.intervalId);
          this.$message.success('进度连续50次相同，任务停止');
        }

        // 如果进度达到100，任务完成
        if (this.progress >= 100) {
          clearInterval(this.intervalId);
          this.$message.success('任务完成');
        }
        // 更新上次的进度
        lastProgress = this.progress;
      })
      .catch((error) => {
        console.error('获取进度失败', error);
        clearInterval(this.intervalId); // 若获取失败则停止轮询
      });
  }, 2000); 
},

    // 停止进度轮询
    stopPolling() {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
.upload-demo {
  margin-bottom: 16px;
}
</style>
