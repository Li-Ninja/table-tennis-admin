// import { LanguageEnum } from '@/enums/common.enum';

export function useLocalStorage() {
  function getToken() {
    return localStorage.getItem('accessToken');
  }

  function setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  function clearToken() {
    localStorage.setItem('accessToken', '');
  }

  // function setLang(lang: LanguageEnum) {
  //   localStorage.setItem('language', lang);
  // }

  // function getLang() {
  //   return localStorage.getItem('language') ?? LanguageEnum['zh-tw'];
  // }

  function clearLang() {
    localStorage.setItem('language', '');
  }

  return {
    getToken,
    setToken,
    clearToken,
    // getLang,
    // setLang,
    clearLang,
  };
}
