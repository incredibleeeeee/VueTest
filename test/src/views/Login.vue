<template>
  <div class="login-form">
    <form @submit.prevent="onSubmit">
      <div>
        <label for="username">用户名:</label>
        <input id="username" v-model="username" type="text" />
      </div>
      <div>
        <label for="password">密码:</label>
        <input id="password" v-model="password" type="password" />
      </div>

      <button type="submit">登录</button>
    </form>
    <div v-if="token">
      <textarea readonly :value="token"></textarea>
      <button @click="copyToken">复制</button>
    </div>
  </div>
</template>

<script>
import api from "@/http";

export default {
  name: "UserLogin",
  data() {
    return {
      username: "",
      password: "", // 假设你需要这个字段进行某种形式的验证或其他用途
      token: "",
    };
  },
  methods: {
    async generateSignature(accountId, key) {
      const ts = String(Date.now());
      const data = accountId + ts + key;
      const encoder = new TextEncoder();
      const dataEncoded = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataEncoded);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return { ts, signature: hashHex };
    },
    async onSubmit() {
      const loginUrl = "http://localhost:8082/doLogin";
      const { ts, signature } = await this.generateSignature(
        this.username,
        this.password
      );

      // 使用 URLSearchParams 构造表单数据
      const params = new URLSearchParams();
      params.append("accountId", this.username);
      params.append("ts", ts);
      params.append("signature", signature);
      params.append("loginType", "API");

      try {
        // 使用api实例发起请求
        const response = await api.post(loginUrl, params); // 注意这里使用api而不是axios
        if (response.data && response.data.code === 200) {
          // 成功获取到令牌并保存到 token 数据属性中
          this.token = response.data.data;
          console.log("token: ", this.token);
          // 成功获取到令牌并保存到LocalStorage中
          localStorage.setItem('token', this.token);
          // this.$router.push('/'); // 或其他你希望用户登录后看到的页面
        } else {
          // 处理其他情况或显示错误消息
          console.error("登录失败，收到的响应：", response.data);
        }
      } catch (error) {
        console.error("登录失败", error);
        // 处理登录失败的情况
      }
    },

    copyToken() {
      if (navigator.clipboard) {
        // 检查 Clipboard API 是否可用
        navigator.clipboard.writeText(this.token).then(
          () => {
            alert("令牌已复制到剪贴板");
          },
          (error) => {
            console.error("复制失败", error);
          }
        );
      } else {
        console.error("浏览器不支持 Clipboard API");
      }
    },
  },
};
</script>


<style scoped>
.login-form {
  max-width: 400px;
  margin: auto;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-form textarea {
  width: 100%; /* 设置文本框的宽度为父容器的100% */
  height: 100px; /* 设置文本框的高度 */
  padding: 8px; /* 可选：添加一些内边距以便于阅读 */
  margin-bottom: 20px; /* 与其他输入元素保持一致的底部外边距 */
  border: 1px solid #ccc; /* 可选：添加一个边框 */
  box-sizing: border-box; /* 确保宽度包含了边框和内边距 */
}

.login-form div {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: 60%;
  padding: 8px;
  line-height: 20px;
}

.login-form button {
  width: 20%;
  padding: 10px;
  background-color: #3498db;
  border: none;
  color: white;
  cursor: pointer;
  margin: 10px;
}
.login-form button:hover {
  background-color: #2980b9;
}
</style>
