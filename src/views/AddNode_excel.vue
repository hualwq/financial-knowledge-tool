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
            action=""
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
          <el-button type="primary" @click="uploadFile" :disabled="!selectedFile">上传</el-button>
        </el-form-item>
        <el-form-item>
          <el-progress :percentage="progress" />
        </el-form-item>
      </el-form>
      <el-image :src="require('../assets/node_excel_law.png')" />
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
    ElProgress,
  },
  data() {
    return {
      selectedFile: null, // 用于存储选择的文件
      progress: 0, // 显示上传进度
      intervalId: null, // 用于保存轮询的ID，以便停止
    };
  },
  methods: {
    // 文件选择更改时触发
    onFileChange(file) {
      this.selectedFile = file.raw; // 获取原始文件数据
      this.$message.success('文件已选择');
    },
    // 在文件上传前进行检查
    beforeUpload(file) {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        this.$message.error('只能上传 Excel 文件！');
      }
      return isExcel; // 若不符合格式则阻止上传
    },
    // 上传文件
    uploadFile() {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // 在发送POST请求之后立即开始轮询
      this.startPolling();

      // 使用 axios 发送 POST 请求，不手动设置 Content-Type
      axios.post('http://10.176.22.62:8001/addnodeexcel/', formData)
        .then((response) => {
          if (response.data.status === 'success') {
            this.$message.success(response.data.message || '文件上传成功');
          } else {
            this.$message.error(response.data.message || '上传过程中发生错误');
          }
        })
        .catch((error) => {
          this.$message.error('文件上传失败');
          console.error(error);
        });
    },

    // 启动轮询进度
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
}
,
  },
};
</script>

<style scoped>
.upload-demo {
  margin-bottom: 16px;
}
</style>
