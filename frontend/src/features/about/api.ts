import type { AboutProfile } from "@/features/about/types"

export async function getAboutProfile(): Promise<AboutProfile> {
  return {
    name: "Momo",
    intro: "把技术文章、项目笔记和阶段性思考整理成长期可回看的记录。",
    description:
      "这个博客更像一份持续增补的研究札记。它不追求热闹，而是希望把每一次学习、实现和复盘，都安静地沉淀成可反复引用的文字。",
    skills: ["React 19", "FastAPI", "PostgreSQL", "SQLAlchemy 2.0", "技术写作"],
    now: [
      "继续完善博客前后台，把写作流程真正跑顺",
      "把零散项目经验整理成更系统的教程文章",
      "建立稳定输出节奏，而不是临时记录",
    ],
  }
}
