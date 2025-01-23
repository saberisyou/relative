import Taro from '@tarojs/taro';
import request from '@/utils/request';
import Beacon from '@/utils/beacon';
import { getGlobalData } from './globalData';

function getPreviewFilePath(url) {
  let fileUrl = '';
  let isParams = '&';
  let fileType = 'file';
  let suffix = '';
  if (url.indexOf('?') > -1) {
    suffix = url.substring(url.lastIndexOf('.'), url.lastIndexOf('?'));
  } else {
    suffix = url.substring(url.lastIndexOf('.'));
    isParams = '?';
  }
  if (
    [
      '.pdf',
      '.txt',
      '.log',
      '.html',
      '.xlsx',
      '.xls',
      '.doc',
      '.docx',
      '.pptx',
      '.ppt',
    ].includes(suffix)
  ) {
    fileUrl = `${url}${isParams}ci-process=doc-preview&dstType=html`; // 不预览的话，doc，xlsx之类的打不开
    fileType = 'file';
  } else if (['.png', '.jpg', '.jpeg', '.JPEG'].includes(suffix)) {
    fileUrl = `${url}`;
    fileType = 'img';
  } else if (
    ['.mp4', '.avi', '.mov', '.rmvb', '.mpeg', '.mpg'].includes(suffix)
  ) {
    fileUrl = `${url}`;
    fileType = 'video';
  }
  return [fileUrl, fileType];
}

/**
 * @param {Object} json
 * @param {Object} type： 默认不传 ==>全部小写;传1 ==>首字母大写;传2 ==>首字母小写
 * 将json的key值进行大小写转换
 */
export function jsonKeysToCase(dataJson: any, type?: number) {
  if (typeof dataJson === 'object') {
    const tempJson = JSON.parse(JSON.stringify(dataJson));
    toCase(tempJson);
    return tempJson;
  }
  return dataJson;

  function toCase(json: any) {
    if (typeof json === 'object') {
      if (Array.isArray(json)) {
        json.forEach(item => {
          toCase(item);
        });
      } else {
        for (const key in json) {
          const item = json[key];
          if (typeof item === 'object') {
            toCase(item);
          }
          delete json[key];
          switch (type) {
            case 1:
              // 驼峰，首字母大写
              json[key.substring(0, 1).toLocaleUpperCase() + key.substring(1)] =
                item;
              break;
              break;
            case 2:
              // 驼峰，首字母小写
              json[key.substring(0, 1).toLocaleLowerCase() + key.substring(1)] =
                item;
              break;
            default:
              // 默认key值全部小写
              json[key.toLocaleLowerCase()] = item;
              break;
          }
        }
      }
    }
  }
}
export function handleTags(tagStr: string) {
  if (!tagStr) return [];
  return tagStr && tagStr.substring(1, tagStr.length - 1).split('><');
}

/**
 * 根据文档类型打开文件
 */
export function openFileByType(goodsName: string, data: Object) {
  if (data.count === 1) {
    const hasLogin = getGlobalData('hasLogin');
    request
      .post(
        hasLogin === true
          ? '/auth/goodsMaterial/pageQuery'
          : '/visit/goodsMaterial/pageQuery',
        {
          MaterialTypeList: [data.materialType],
          GoodsName: goodsName,
          PageNumber: 1,
          PageSize: 99,
        },
      )
      .then((res: any) => {
        const item = res.dataList[0];
        if (!item) {
          Taro.showToast({ title: '未查询到文档', icon: 'none' });
        }
        Beacon.sendData('click_matter', {
          product_id: item?.goodsID,
          product_name: item?.goodsName,
          material_id: item?.materialID,
          material_name: item?.materialTitle,
        });

        const fileName = item.materialTitle;
        try {
          const url = item.materialAttachment;
          if (!url) {
            return;
          }
          openPreviewFile(fileName, url, item, data.materialType);
        } catch (err) {
          console.log(err);
        }
      });
  } else if (data.count > 1) {
    Taro.navigateTo({
      url: `/pages/fileList/fileList?goodsName=${goodsName}&type=${data.materialType}&typeName=${data.materialTypeName}`,
    });
  }
}

/**
 * 打开单个文件
 * @param materials
 */
export function openSingleFile(materials: any) {
  const fileName = materials.materialTitle;
  try {
    Beacon.sendData('click_matter', {
      product_id: materials?.goodsID,
      product_name: materials?.goodsName,
      material_id: materials?.materialID,
      material_name: materials?.materialTitle,
    });
    const url = materials.materialAttachment;
    if (!url) {
      return;
    }
    openPreviewFile(fileName, url, materials, materials.materialTypeID);
  } catch (err) {
    console.log(err);
  }
}

export function openPreviewFile(fileName, cosUrl, materials, type) {
  const [previewUrl, fileType] = getPreviewFilePath(cosUrl);
  console.log(previewUrl);
  if (!materials) return;
  Taro.navigateTo({
    url: `/pages/file/file?type=${type}&goodsId=${
      materials.goodsID
    }&materialID=${
      materials.materialID
    }&fileName=${fileName}&fileType=${fileType}&cosUrl=${encodeURIComponent(cosUrl)}`,
  });
  return;
  //   if (fileType !== 'file') {
  //     Taro.navigateTo({
  //       url: `/pages/file/file?type=${type}&goodsId=${materials.goodsID}&materialID=${
  //         materials.materialID
  //       }&fileName=${fileName}&fileType=${fileType}&cosUrl=${encodeURIComponent(cosUrl)}`,
  //     });
  //   } else {
  //     Taro.request({
  //       url: previewUrl,
  //       success(res) {
  //         const m = res.data && res.data.match(/PREVIEW_URL\s*=\s*'([^']+)'/);
  //         if (!m) return Taro.showToast({ url: '文档内容获取失败', icon: 'none' });
  //         const realUrl = `${m[1]}&simple&hidecmb`;
  //
  //         Taro.navigateTo({
  //           url: `/pages/file/file?type=${type}&goodsId=${materials.goodsID}&materialID=${
  //             materials.materialID
  //           }&fileName=${fileName}&fileType=${fileType}&cosUrl=${encodeURIComponent(cosUrl)}`,
  //         });
  //       },
  //       fail() {
  //         Taro.showToast({ url: '文档内容获取失败', icon: 'none' });
  //       },
  //     });
  //   }
}

export function getPreviewFile(url) {
  const [fileUrl, fileType] = getPreviewFilePath(decodeURIComponent(url));
  if (fileType !== 'file') {
    return new Promise<void>((resolve, reject) => {
      resolve(fileUrl);
    });
  }
  if (!fileUrl || !fileUrl.trim()) {
    Taro.showToast({
      title: '文件url错误',
      icon: 'none',
    });
  }
  return new Promise<void>((resolve, reject) => {
    Taro.request({
      url: fileUrl,
      success(res) {
        const m = res.data && res.data.match(/PREVIEW_URL\s*=\s*'([^']+)'/);
        if (!m) {
          reject(null);
        }
        const realUrl = `${m[1]}&simple&hidecmb`;
        resolve(encodeURIComponent(realUrl));
      },
      fail() {
        reject(null);
      },
    });
  });
}
export function getDownloadUrl(url: string) {
  return `${url}&response-content-disposition=attachment`;
}
export function getClientIp() {
  Taro.request({
    url: 'https://open.onebox.so.com/dataApi?type=ip&src=onebox&tpl=0&num=1&query=ip&url=ip',
    success(res) {
      Taro.setStorageSync('clientIp', res.data.ip);
    },
    fail() {
      console.log('获取ip失败');
    },
  });
}
// export function isEncodeUrl(url: string) {
//   return decodeURIComponent(url) === url;
// }

export function throttle(fn: Function, gapTime?: number) {
  if (gapTime === null || gapTime === undefined) {
    gapTime = 1500;
  }
  let _lastTime = null;
  // 返回新的函数
  return function () {
    const _nowTime = +new Date();
    // @ts-ignore
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments);
      _lastTime = _nowTime;
    }
  };
}

const dateFormat = function (date, fmt) {
  let ret;
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
      );
    }
  }
  return fmt;
};
export const FormatTime = function (value) {
  if (value === undefined || value === 0) {
    return '-';
  }
  return dateFormat(new Date(value * 1000), 'yyyy/MM/dd HH:mm:ss');
};

/**
 *
 * @param imgUrl
 * @description 需要搭配使用<Canvas style='position: absolute; top: -1000px; left: -1000px; width: 750px; height: 600px; background: #000;' canvas-id='canvas'></Canvas>
 * @returns
 */
export const cutShareImg = imgUrl =>
  new Promise(resolve => {
    const info = Taro.getSystemInfoSync();
    Taro.getImageInfo({
      src: imgUrl, // 原图路径
      success: res => {
        const ctx = Taro.createCanvasContext('canvas');
        let canvasW = 0;
        const canvasH = res.height;
        canvasW = (res.height / 4) * 5;
        let dw = 0;
        let dh = 0;
        let dx = 0;
        let dy = 0;
        const drp = 750 / info.screenWidth;
        if (res.height >= res.width) {
          // 竖图和正方形图
          dy = 0;
          dh = (info.screenWidth / 5) * 4 * drp;
          dw = (dh / res.height) * res.width;
          dx = (750 - dw) / 2;
        }
        if (res.width > res.height) {
          // 横图
          dx = 0;
          dw = info.screenWidth * drp;
          dh = (info.screenWidth / res.width) * res.height * drp;
          dy = (600 - dh) / 2;
        }

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.drawImage(res.path, 0, 0, res.width, res.height, dx, dy, dw, dh);
        ctx.draw(false, () => {
          Taro.canvasToTempFilePath({
            destWidth: 750,
            destHeight: 600,
            canvasId: 'canvas',
            fileType: 'jpg', // 注意jpg默认背景为透明
            success: res2 => {
              // 设置分享图片路径
              resolve(res2.tempFilePath);
            },
          });
        });
      },
    });
  });
