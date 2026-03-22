import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const UserAgreementPage = () => {
  const { t } = useI18n();

  const sections = [
    { title: t("一、服务条款", "1. Service terms"), content: t("欢迎使用虫识应用。本协议约定您与虫识之间关于使用本应用的权利义务。注册或使用本应用即表示您同意本协议全部条款。如不同意，请勿注册或停止使用。", "Welcome to BugSight. This agreement describes the rights and obligations between you and the platform when using the app. By registering or using the app, you agree to all terms. If you do not agree, please do not register or continue using the app.") },
    { title: t("二、行为规范", "2. User conduct"), content: t("用户应遵守法律法规，不得发布违法、侵权、虚假信息。社区互动中应尊重他人，禁止骚扰、歧视、恶意攻击等行为。违反者将被限制功能或封禁账号。", "Users must comply with laws and regulations and must not post illegal, infringing, or misleading information. Community interactions should remain respectful, and harassment, discrimination, or abusive behavior is prohibited. Violations may lead to restricted access or account suspension."), highlight: true },
    { title: t("三、知识产权", "3. Intellectual property"), content: t("本应用的所有内容，包括但不限于文字、图片、音频、视频、软件、算法、界面设计等，均受知识产权法律保护。用户发布的内容，用户保留所有权，但授予平台非排他性的使用许可。", "All content in the app—including text, images, audio, video, software, algorithms, and interface design—is protected by intellectual property laws. Users retain ownership of the content they post, while granting the platform a non-exclusive license to use it."), highlight: true },
    { title: t("四、免责声明", "4. Disclaimer"), content: t("昆虫识别结果仅供参考，不构成专业鉴定意见。对于因使用识别结果而造成的任何损失，本应用不承担责任。遇到可能有毒或危险的昆虫，请咨询专业人士。", "Recognition results are for reference only and do not replace professional identification. The app is not responsible for any loss resulting from the use of recognition results. If you encounter a potentially venomous or dangerous insect, consult a professional." ) },
    { title: t("五、协议修改", "5. Agreement updates"), content: t("我们保留修改本协议的权利。修改后的协议将在应用内公布，公布后继续使用即视为接受修改。重大条款变更将通过显著方式通知用户。", "We reserve the right to update this agreement. Updated terms will be published in the app, and continued use after publication means you accept the changes. Material changes will be highlighted through a noticeable in-app notice.") },
    { title: t("六、法律适用", "6. Governing law"), content: t("本协议的订立、执行和解释均适用中华人民共和国法律。因本协议引起的争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院裁决。", "This agreement is governed by the laws of the People's Republic of China. Any disputes arising from this agreement should first be resolved through friendly consultation, and if unresolved, submitted to a competent people's court.") },
  ];

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("用户协议", "User agreement")} />
        <div className="px-5 mt-2 space-y-5">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-subtitle text-foreground font-bold mb-2">{section.title}</h3>
              <p className={`text-body leading-[1.6] ${section.highlight ? "text-foreground font-medium" : "text-foreground/80"}`}>{section.content}</p>
            </div>
          ))}
        </div>
        <p className="px-5 mt-8 text-small text-muted-foreground text-center">{t("最后更新日期：2026 年 1 月 15 日", "Last updated: January 15, 2026")}</p>
      </div>
    </MobileLayout>
  );
};

export default UserAgreementPage;
