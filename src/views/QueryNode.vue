<template>
    <div>
      <h1>节点查询</h1>
      <el-form :model="form" ref="formRef" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="form.company_name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          <el-input v-model="form.credit_number" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="form.english_name" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="法定代表人">
          <el-input v-model="form.legal_representative" placeholder="请输入法定代表人" />
        </el-form-item>
        <el-form-item label="证券代码">
          <el-input v-model="form.security_code" placeholder="请输入证券代码" />
        </el-form-item>
        <el-form-item label="股票简称">
          <el-input v-model="form.stock_abbreviation" placeholder="请输入股票简称" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!isButtonEnabled"
            @click="submitQuery"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 数据展示 -->
      <el-descriptions title="公司信息">
  <el-descriptions-item
    v-for="(item, index) in data"
    :key="index"
    :label="item.label"
  >
    {{ item.value }}
  </el-descriptions-item>
</el-descriptions>

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        form: {
          company_name: '',
          credit_number: '',
          english_name: '',
          legal_representative: '',
          security_code: '',
          stock_abbreviation: '',
        },
        data: [
        { label: '公司中文名称', key: 'company_name', value: ''},
        { label: '统一社会信用代码', key: 'credit_number', value: ''},
        { label: '省份', key: 'province', value: '' },
        { label: '公司类型', key: 'company_type' , value: ''},
        { label: '市', key: 'city' , value: ''},
        { label: '区县信息', key: 'district_info' , value: ''},
        { label: '主营业务', key: 'main_business' , value: ''},
        { label: 'A股证券代码', key: 'a_stock_code' , value: ''},
        { label: '组织形式', key: 'organization_form' , value: ''},
        { label: '证券名称', key: 'security_name' , value: ''},
        { label: '股票简称', key: 'stock_abbreviation' , value: ''},
        { label: '证券代码', key: 'security_code' , value: ''},
        { label: '董事会秘书代码', key: 'board_secretary_code' , value: ''},
        { label: '经营范围', key: 'business_scope' , value: ''},
        { label: '注册地址', key: 'registered_address' , value: ''},
        { label: '法定代表人', key: 'legal_representative' , value: ''},
        { label: '公司曾用名', key: 'former_company_name' , value: ''},
        { label: '公司电话', key: 'company_phone' , value: ''},
        { label: '公司简介', key: 'company_profile' , value: ''},
        { label: '英文名称', key: 'english_name' , value: ''},
        { label: 'B股证券代码', key: 'b_stock_code' , value: ''},
        { label: '实际控制人', key: 'actual_controller' , value: ''},
      ],
        dialogVisible: false
      };
    },
    computed: {
      isButtonEnabled() {
        const filledCount = Object.values(this.form).filter(value => value).length;
        return filledCount === 1; // 仅当有且只有一个输入框被填入时返回 true
      },
    },
    methods: {
      submitQuery() {
        const queryParams = Object.entries(this.form)
        // eslint-disable-next-line
          .filter(([key, value]) => value) // 只保留有值的查询参数
          .map(([key, value]) => ({ label: key, value }));
  
        if (queryParams.length === 0) {
          alert('请至少输入一个查询条件');
          return;
        }
        // 调用后端 API
        this.fetchData(queryParams);
      },
      async fetchData(params) {
    try {
        const response = await axios.post('http://localhost:8001/querynode/', params);
        // console.log('查询结果:', response.data);
        if (response.data.company_name && response.data.company_name.length > 0) {
            // 假设你有一个方法来处理成功的结果
            this.handleSuccess(response.data);
        } else {
            alert(response.data.message || '查询失败');
        }
    } catch (error) {
        console.error('请求失败:', error);
        alert('请求失败，请重试');
    }
},
    handleSuccess(responseData) {
        // 假设 responseData 是你从后端返回的数据
      // console.log(responseData)
      this.dialogVisible = true;
      this.data.forEach(item => {
      item.value = responseData[item.key] || '';
});
console.log(this.data)
console.log(this.dialogVisible)
    },
    },

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
  