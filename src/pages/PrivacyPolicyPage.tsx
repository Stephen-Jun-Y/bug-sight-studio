import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const sections = [
  { title: "一、信息收集", content: "我们收集您在使用本应用过程中主动提供的信息，包括但不限于：注册信息（手机号、邮箱）、个人资料（昵称、头像）、识别记录（照片、位置信息）。我们也会自动收集设备信息、日志信息和使用数据，以改善服务质量。" },
  { title: "二、信息使用", content: "我们将收集的信息用于：提供昆虫识别服务、个性化推荐、社区互动功能、数据分析与产品改进。我们不会将您的个人信息用于与上述目的无关的其他用途。" },
  { title: "三、信息共享", content: "未经您的同意，我们不会与任何第三方共享您的个人信息，但以下情况除外：获得您明确同意的；根据法律法规的要求；为保护公共利益的；学术研究或统计需要（已去标识化处理）。" },
  { title: "四、信息保护", content: "我们采用业界标准的安全技术和管理措施保护您的信息，包括数据加密传输（SSL/TLS）、访问权限控制、安全审计和数据备份。但请理解，互联网环境并非百分之百安全。" },
  { title: "五、用户权利", content: "您有权访问、更正、删除您的个人信息，也有权撤回授权同意、注销账号。您可以在「设置 > 数据导出」中导出您的数据，在「设置 > 注销账号」中删除账号。" },
  { title: "六、政策更新", content: "我们可能适时修订本隐私政策。重大变更将通过应用内通知告知您。继续使用本应用即表示您同意更新后的隐私政策。如您不同意，请停止使用并注销账号。" },
];

const PrivacyPolicyPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="隐私政策" />
        <div className="px-5 mt-2 space-y-5">
          {sections.map((s, i) => (
            <div key={i}>
              <h3 className="text-subtitle text-foreground font-bold mb-2">{s.title}</h3>
              <p className="text-body text-foreground/80 leading-[1.6]">{s.content}</p>
            </div>
          ))}
        </div>
        <p className="px-5 mt-8 text-small text-muted-foreground text-center">最后更新日期：2026 年 1 月 15 日</p>
      </div>
    </MobileLayout>
  );
};

export default PrivacyPolicyPage;
