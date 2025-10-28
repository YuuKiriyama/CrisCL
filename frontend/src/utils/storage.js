// storage.js - 后端API存储封装
// 动态检测API地址，支持移动设备访问

// 尝试多个可能的API地址
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // 候选API地址列表
  const candidates = [
    'http://localhost:3001/api',
    `http://${hostname}:3001/api`,
    `http://10.245.74.88:3001/api`, // 您的实际IP地址
    'http://192.168.1.100:3001/api', // 常见的局域网地址
    'http://192.168.0.100:3001/api', // 另一个常见的局域网地址
  ];
  
  // 如果是HTTPS，也尝试HTTPS版本
  if (protocol === 'https:') {
    candidates.push(
      'https://localhost:3001/api',
      `https://${hostname}:3001/api`,
      `https://10.245.74.88:3001/api`,
    );
  }
  
  // 返回第一个候选地址（实际检测会在使用时进行）
  return candidates[0];
};

const API_BASE_URL = getApiBaseUrl();

// 存储当前可用的API地址
let currentApiUrl = API_BASE_URL;

// 检测可用的API地址
const detectApiUrl = async () => {
  const candidates = [
    'http://localhost:3001/api',
    `http://${window.location.hostname}:3001/api`,
    `http://10.245.74.88:3001/api`,
    'http://192.168.1.100:3001/api',
    'http://192.168.0.100:3001/api',
  ];
  
  for (const url of candidates) {
    try {
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        timeout: 3000 
      });
      if (response.ok) {
        console.log(`找到可用的API地址: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`API地址 ${url} 不可用:`, error.message);
    }
  }
  
  console.error('所有API地址都不可用');
  return null;
};

// 获取当前API地址
const getCurrentApiUrl = async () => {
  if (!currentApiUrl) {
    currentApiUrl = await detectApiUrl();
  }
  return currentApiUrl;
};

export const storage = {
  // 获取历史记录
  get: async (key) => {
    try {
      const apiUrl = await getCurrentApiUrl();
      if (!apiUrl) {
        throw new Error('无法连接到服务器');
      }
      
      if (key === 'poker-history') {
        const response = await fetch(`${apiUrl}/history`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          return { value: JSON.stringify(result.data) };
        } else {
          console.error('API返回错误:', result.error);
          return null;
        }
      } else if (key === 'poker-favorites') {
        const response = await fetch(`${apiUrl}/favorites`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          return { value: JSON.stringify(result.data) };
        } else {
          console.error('API返回错误:', result.error);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('获取数据失败:', error);
      // 如果是网络错误，返回空数组而不是null
      if (key === 'poker-history') {
        return { value: JSON.stringify([]) };
      } else if (key === 'poker-favorites') {
        return { value: JSON.stringify([]) };
      }
      return null;
    }
  },

  // 保存数据
  set: async (key, value) => {
    try {
      const apiUrl = await getCurrentApiUrl();
      if (!apiUrl) {
        throw new Error('无法连接到服务器');
      }
      
      const data = JSON.parse(value);
      if (key === 'poker-history') {
        const response = await fetch(`${apiUrl}/history`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          console.log('历史记录保存成功');
          return true;
        } else {
          console.error('保存失败:', result.error);
          return false;
        }
      } else if (key === 'poker-favorites') {
        const response = await fetch(`${apiUrl}/favorites`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          console.log('收藏列表保存成功');
          return true;
        } else {
          console.error('保存失败:', result.error);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  },

  // 检查服务器连接状态
  checkConnection: async () => {
    try {
      const apiUrl = await getCurrentApiUrl();
      if (!apiUrl) {
        return false;
      }
      const response = await fetch(`${apiUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('服务器连接检查失败:', error);
      // 尝试重新检测API地址
      currentApiUrl = null;
      return false;
    }
  },

  // 手动重新检测API地址
  resetApiUrl: () => {
    currentApiUrl = null;
  }
};
