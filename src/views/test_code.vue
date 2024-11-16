<template>
  <div>
    <el-progress :percentage="progress"></el-progress>
    <el-button @click="startPolling">开始运行</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      progress: 0,
    };
  },
  methods: {
    startPolling() {
      // 模拟开始任务，启动轮询
      this.pollingInterval = setInterval(this.getProgress, 1000); // 每隔2秒发送一次请求
    },
    getProgress() {
      axios.get('http://10.176.22.62:8001/test/')  // 请求后端进度接口
        .then(response => {
          this.progress = response.data.progress;  // 假设后端返回的数据格式为 { progress: 50 }
          if (this.progress >= 100) {
            clearInterval(this.pollingInterval);  // 进度完成后停止轮询
            this.pollingInterval = null;
          }
        })
        .catch(error => {
          console.error("获取进度失败", error);
          clearInterval(this.pollingInterval);  // 发生错误时停止轮询
        });
    }
  },
};
</script>
