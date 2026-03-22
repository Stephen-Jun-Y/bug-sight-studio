import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const PrivacyPolicyPage = () => {
  const { t } = useI18n();

  const sections = [
    { title: t("一、信息收集", "1. Information we collect"), content: t("我们收集您在使用本应用过程中主动提供的信息，包括但不限于：注册信息（手机号、邮箱）、个人资料（昵称、头像）、识别记录（照片、位置信息）。我们也会自动收集设备信息、日志信息和使用数据，以改善服务质量。", "We collect information you provide while using the app, including registration data (phone number and email), profile data (nickname and avatar), and recognition records (photos and location data). We also collect device, log, and usage information to improve the service.") },
    { title: t("二、信息使用", "2. How we use information"), content: t("我们将收集的信息用于：提供昆虫识别服务、个性化推荐、社区互动功能、数据分析与产品改进。我们不会将您的个人信息用于与上述目的无关的其他用途。", "We use the information we collect to provide insect recognition, personalized recommendations, community features, analytics, and product improvements. We do not use your personal information for unrelated purposes.") },
    { title: t("三、信息共享", "3. Information sharing"), content: t("未经您的同意，我们不会与任何第三方共享您的个人信息，但以下情况除外：获得您明确同意的；根据法律法规的要求；为保护公共利益的；学术研究或统计需要（已去标识化处理）。", "We do not share your personal information with third parties without your consent, except when required by law, needed to protect the public interest, or used for research and statistics after de-identification.") },
    { title: t("四、信息保护", "4. Information protection"), content: t("我们采用业界标准的安全技术和管理措施保护您的信息，包括数据加密传输（SSL/TLS）、访问权限控制、安全审计和数据备份。但请理解，互联网环境并非百分之百安全。", "We protect your data with industry-standard safeguards, including encrypted transmission (SSL/TLS), access control, security audits, and backups. Please note that no internet environment is 100% secure.") },
    { title: t("五、用户权利", "5. Your rights"), content: t("您有权访问、更正、删除您的个人信息，也有权撤回授权同意、注销账号。您可以在「设置 > 数据导出」中导出您的数据，在「设置 > 注销账号」中删除账号。", "You may access, correct, or delete your personal information, withdraw consent, and close your account. You can export your data from Settings > Data Export and remove your account from Settings > Delete Account.") },
    { title: t("六、政策更新", "6. Policy updates"), content: t("我们可能适时修订本隐私政策。重大变更将通过应用内通知告知您。继续使用本应用即表示您同意更新后的隐私政策。如您不同意，请停止使用并注销账号。", "We may update this policy from time to time. Material changes will be announced in-app. By continuing to use the app, you agree to the updated policy. If you do not agree, please stop using the app and close your account.") },
  ];

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("隐私政策", "Privacy policy")} />
        <div className="px-5 mt-2 space-y-5">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-subtitle text-foreground font-bold mb-2">{section.title}</h3>
              <p className="text-body text-foreground/80 leading-[1.6]">{section.content}</p>
            </div>
          ))}
        </div>
        <p className="px-5 mt-8 text-small text-muted-foreground text-center">{t("最后更新日期：2026 年 1 月 15 日", "Last updated: January 15, 2026")}</p>
      </div>
    </MobileLayout>
  );
};

export default PrivacyPolicyPage;
