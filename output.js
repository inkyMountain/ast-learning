import wepy from 'wepy';import Banners from '@/components/Banners'; //banner切换调度配置{
  Banners
}{
  banners: [],
  config: {
    current: 0,
    //当前所在图片的 index
    indicatorDots: false
  },
  style: '',
  itemStyle: '',
  current: 0
}{
  onBannerChange(ev) {
    this.handleBannerChange(ev);
  },

  pageShow() {
    bannerChangeDispatch.pause = false;
    bannerChangeDispatch.ev && this.handleBannerChange(bannerChangeDispatch.ev);
  },

  pageHide() {
    bannerChangeDispatch.pause = true;
  },

  /** * @public * @param data */
  init(data) {
    this.banners = data.banners;
    this.$apply();
  },

  handleBannerChange(ev) {
    if (bannerChangeDispatch.pause) {
      //处于后台时只记录最新状态，不进行变换处理，避免：iOS-切到后台-一段时间后回来-背景连续快速频繁变换
      bannerChangeDispatch.ev = ev;
      return;
    }

    this.current = ev.detail.current;
    this.$apply();
    this.$emit('change', ev);
  }

}