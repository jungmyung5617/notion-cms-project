// 사이트 공통 설정 (이름, 설명, 기본 URL, 네비게이션 메뉴)
export type NavItem = {
  title: string;
  href: string;
};

export const siteConfig = {
  name: "개인 음식점 리뷰 블로그",
  description: "Notion에서 작성한 개인 음식점 리뷰를 모아 보는 블로그입니다.",
  // 배포 시 NEXT_PUBLIC_SITE_URL을 설정하고, 없으면 로컬 주소를 사용한다
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nav: [
    { title: "홈", href: "/" },
    { title: "소개", href: "/about" },
    { title: "문의", href: "/contact" },
  ] satisfies NavItem[],
};
