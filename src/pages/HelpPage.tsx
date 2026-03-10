import { useState } from "react";
import { ChevronDown, ChevronUp, Camera } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const faqs = [
  { q: "如何识别昆虫？", a: "打开应用，点击首页的拍照识别按钮，将昆虫置于取景框内，点击快门按钮即可。也可以从相册选择已有照片进行识别。" },
  { q: "识别结果不准确怎么办？", a: "您可以在识别结果页面点击「报告」按钮反馈不准确的结果。我们会持续优化识别算法。" },
  { q: "如何删除识别记录？", a: "在历史记录页面，左滑对应的记录，点击删除按钮即可。" },
  { q: "支持哪些昆虫种类？", a: "目前支持超过 10,000 种常见昆虫的识别，覆盖鳞翅目、鞘翅目、膜翅目等主要类群。" },
];

const HelpPage = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="帮助与反馈" />
        {/* FAQ */}
        <div className="px-5 mt-2">
          <p className="text-subtitle text-foreground mb-3">常见问题</p>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-xl card-shadow micro-border overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 tap-scale"
                >
                  <span className="text-body text-foreground text-left">{faq.q}</span>
                  {open === i ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                </button>
                {open === i && (
                  <div className="px-4 pb-4 text-caption text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback form */}
        <div className="px-5 mt-6">
          <p className="text-subtitle text-foreground mb-3">提交反馈</p>
          <div className="bg-card rounded-xl p-4 card-shadow micro-border space-y-4">
            <select className="w-full h-[44px] bg-secondary rounded-md px-4 text-body text-foreground outline-none">
              <option>问题类型</option>
              <option>功能建议</option>
              <option>识别错误</option>
              <option>应用Bug</option>
              <option>其他</option>
            </select>
            <textarea placeholder="请描述您的问题或建议..." rows={4} className="w-full bg-secondary rounded-md px-4 py-3 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow resize-none" />
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <button key={i} className="w-20 h-20 border-2 border-dashed border-border rounded-md flex items-center justify-center btn-tap">
                  <Camera size={22} className="text-muted-foreground" />
                </button>
              ))}
            </div>
            <input placeholder="联系方式（可选）" className="w-full h-[44px] bg-secondary rounded-md px-4 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow" />
            <button className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap">提交反馈</button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HelpPage;
