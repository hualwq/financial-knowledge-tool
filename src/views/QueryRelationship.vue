<template>
  <div>
    <h1>关系查询</h1>

    <h2>公司1</h2>
    <el-form :model="formCompany1" ref="formRef1" label-width="120px">
      <el-form-item label="公司名称">
        <el-input v-model="formCompany1.company_name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="社会信用代码">
        <el-input v-model="formCompany1.credit_number" placeholder="请输入社会信用代码" />
      </el-form-item>
    </el-form>

    <h2>公司2</h2>
    <el-form :model="formCompany2" ref="formRef2" label-width="120px">
      <el-form-item label="公司名称">
        <el-input v-model="formCompany2.company_name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="社会信用代码">
        <el-input v-model="formCompany2.credit_number" placeholder="请输入社会信用代码" />
      </el-form-item>
    </el-form>

    <el-form-item>
      <el-form-item label="关系名称">
        <el-input v-model="relationship_name" placeholder="请输入关系名称" />
      </el-form-item>
      <el-button
        type="primary"
        :disabled="false"
        @click="submitQuery"
      >
        查询
      </el-button>
    </el-form-item>

    <!-- 数据展示 -->
    <el-descriptions title="关系信息">
      <el-descriptions-item
        v-for="(item, index) in data"
        :key="index"
        :label="'关系描述'"
      >
        {{ item }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formCompany1: {
        company_name: '',
        credit_number: ''
      },
      formCompany2: {
        company_name: '',
        credit_number: ''
      },
      relationship_name: '',
      data: [],  // 将存储的字符串数据
    };
  },
  methods: {
    submitQuery() {
      const queryParams1 = this.createQueryParams(this.formCompany1);
      const queryParams2 = this.createQueryParams(this.formCompany2);
      const hasCompanyInfo = queryParams1.length > 0 || queryParams2.length > 0;
      const hasRelationshipName = this.relationship_name.trim().length > 0;

      if (!hasCompanyInfo && !hasRelationshipName) {
        alert('请至少输入公司信息或关系名称');
        return;
      }

      // Combine query parameters for both companies and relationship name
      const queryParams = {
        company1: queryParams1,
        company2: queryParams2,
        relation_name: this.relationship_name,
      };

      this.fetchData(queryParams);
    },
    
    createQueryParams(form) {
      return Object.entries(form)
      // eslint-disable-next-line
        .filter(([key, value]) => value)
        .map(([key, value]) => ({ label: key, value }));
    },

    async fetchData(params) {
      try {
        const response = await axios.post('http://10.176.22.62:8001/queryrelationship/', params);

        if (response.data.status === 'success') {
          this.handleSuccess(response.data.relationships);  // 处理字符串数据
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('请求失败:', error);
        alert('请求失败，请重试');
      }
    },

    // 处理字符串类型的响应数据
    handleSuccess(responseData) {
      // 假设响应数据是一个字符串，直接存储在 data 中
      this.data = [responseData];  // 将响应字符串放入数组，以便在模板中渲染
    },
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: right;
}
</style>
