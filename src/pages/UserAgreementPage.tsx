import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const sections = [
  { title: "一、服务条款", content: "欢迎使用虫识应用。本协议约定您与虫识之间关于使用本应用的权利义务。注册或使用本应用即表示您同意本协议全部条款。如不同意，请勿注册或停止使用。" },
  { title: "二、行为规范", content: "用户应遵守法律法规，不得发布违法、侵权、虚假信息。社区互动中应尊重他人，禁止骚扰、歧视、恶意攻击等行为。违反者将被限制功能或封禁账号。", highlight: true },
  { title: "三、知识产权", content: "本应用的所有内容，包括但不限于文字、图片、音频、视频、软件、算法、界面设计等，均受知识产权法律保护。用户发布的内容，用户保留所有权，但授予平台非排他性的使用许可。", highlight: true },
  { title: "四、免责声明", content: "昆虫识别结果仅供参考，不构成专业鉴定意见。对于因使用识别结果而造成的任何损失，本应用不承担责任。遇到可能有毒或危险的昆虫，请咨询专业人士。" },
  { title: "五、协议修改", content: "我们保留修改本协议的权利。修改后的协议将在应用内公布，公布后继续使用即视为接受修改。重大条款变更将通过显著方式通知用户。" },
  { title: "六、法律适用", content: "本协议的订立、执行和解释均适用中华人民共和国法律。因本协议引起的争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院裁决。" },
];

const UserAgreementPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="用户协议" />
        <div className="px-5 mt-2 space-y-5">
          {sections.map((s, i) => (
            <div key={i}>
              <h3 className="text-subtitle text-foreground font-bold mb-2">{s.title}</h3>
              <p className={`text-body leading-[1.6] ${s.highlight ? "text-foreground font-medium" : "text-foreground/80"}`}>{s.content}</p>
            </div>
          ))}
        </div>
        <p className="px-5 mt-8 text-small text-muted-foreground text-center">最后更新日期：2026 年 1 月 15 日</p>
      </div>
    </MobileLayout>
  );
};

export default UserAgreementPage;
