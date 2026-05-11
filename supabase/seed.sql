-- =========================================================
-- CRM Dashboard 演示种子数据
-- 用法:
--   1) 在你的应用里完成一次注册/登录,确保 auth.users 至少有一条记录
--   2) 在 Supabase Dashboard → SQL Editor → New Query 里粘贴本文件并 Run
--   3) 默认会把数据插到「最近一次注册的用户」名下;
--      如果你想绑定到指定账号,把下面 SELECT 那一行替换为:
--         v_uid := 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
-- =========================================================

DO $$
DECLARE
  v_uid uuid;

  -- 公司 id 占位
  c_tencent  uuid;
  c_alibaba  uuid;
  c_bytedance uuid;
  c_meituan  uuid;
  c_pingan   uuid;
  c_cmb      uuid;
  c_xueersi  uuid;
  c_united   uuid;
  c_shunfeng uuid;
  c_xiaomi   uuid;
BEGIN
  ---------------------------------------------------------
  -- 0. 取当前用户 id(默认绑定最近注册的账号)
  ---------------------------------------------------------
  SELECT id INTO v_uid FROM auth.users ORDER BY created_at DESC LIMIT 1;

  IF v_uid IS NULL THEN
    RAISE EXCEPTION '没有找到任何用户,请先在应用里注册一个账号再执行本脚本';
  END IF;

  ---------------------------------------------------------
  -- 1. 公司(10 家,行业各异)
  ---------------------------------------------------------
  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '腾讯科技',     '互联网',   'https://www.tencent.com',  now() - interval '5 months')
    RETURNING id INTO c_tencent;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '阿里巴巴',     '电商',     'https://www.alibaba.com',  now() - interval '5 months')
    RETURNING id INTO c_alibaba;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '字节跳动',     '互联网',   'https://www.bytedance.com', now() - interval '4 months')
    RETURNING id INTO c_bytedance;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '美团',         '本地生活', 'https://www.meituan.com',  now() - interval '4 months')
    RETURNING id INTO c_meituan;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '中国平安',     '金融保险', 'https://www.pingan.com',   now() - interval '3 months')
    RETURNING id INTO c_pingan;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '招商银行',     '银行',     'https://www.cmbchina.com', now() - interval '3 months')
    RETURNING id INTO c_cmb;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '学而思教育',   '在线教育', 'https://www.xueersi.com',  now() - interval '2 months')
    RETURNING id INTO c_xueersi;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '联合健康医疗', '医疗',     'https://www.uhg.com',      now() - interval '2 months')
    RETURNING id INTO c_united;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '顺丰速运',     '物流',     'https://www.sf-express.com', now() - interval '1 months')
    RETURNING id INTO c_shunfeng;

  INSERT INTO companies (user_id, name, industry, website, created_at) VALUES
    (v_uid, '小米科技',     '消费电子', 'https://www.mi.com',       now() - interval '10 days')
    RETURNING id INTO c_xiaomi;

  ---------------------------------------------------------
  -- 2. 联系人(30 条;状态分布约 active 15 / lead 10 / lost 5)
  --    时间从 5 个月前到本月,柱状图会有起伏
  ---------------------------------------------------------
  INSERT INTO contacts (user_id, name, email, phone, company_id, status, notes, created_at) VALUES
    -- ---------- 本月(8 条,主要 active + lead) ----------
    (v_uid, '张明',   'zhangming@tencent.com',     '13800001111', c_tencent,   'active', '微信生态合作意向,本月已完成首次对接会议', now() - interval '2 days'),
    (v_uid, '李娜',   'lina@alibaba.com',          '13800002222', c_alibaba,   'active', '云服务采购方,合同金额 80 万', now() - interval '3 days'),
    (v_uid, '王芳',   'wangfang@bytedance.com',    '13800003333', c_bytedance, 'lead',   '抖音电商 KA 客户,等内部审批',           now() - interval '5 days'),
    (v_uid, '陈伟',   'chenwei@meituan.com',       '13800004444', c_meituan,   'active', '到店事业部,已签年框',                     now() - interval '7 days'),
    (v_uid, '刘洋',   'liuyang@pingan.com',        '13800005555', c_pingan,    'lead',   '保险 SaaS 试用中,下周演示',               now() - interval '9 days'),
    (v_uid, '杨光',   'yangguang@xiaomi.com',      '13800006666', c_xiaomi,    'active', 'IoT 部门技术 PM,推进 API 联调',           now() - interval '11 days'),
    (v_uid, '赵磊',    NULL,                        '13800007777', NULL,        'lead',   '展会上加的微信,身份待核实',                now() - interval '14 days'),
    (v_uid, '黄海',   'huanghai@xueersi.com',      '13800008888', c_xueersi,   'active', '老客户续费,推荐了同事',                    now() - interval '18 days'),

    -- ---------- 上个月(6 条) ----------
    (v_uid, '孙琳',   'sunlin@cmb.com',            '13900001111', c_cmb,       'active', '私人银行渠道,推进对公账户合作',            now() - interval '32 days'),
    (v_uid, '周婷',   'zhouting@sf-express.com',   '13900002222', c_shunfeng,  'active', '冷链物流报价已发,等回执',                  now() - interval '36 days'),
    (v_uid, '吴军',   'wujun@uhg.com',             '13900003333', c_united,    'lead',   '医疗信息化采购初筛阶段',                   now() - interval '40 days'),
    (v_uid, '郑斌',   'zhengbin@tencent.com',      '13900004444', c_tencent,   'lead',   '游戏部门 BD,合作模式待明确',               now() - interval '45 days'),
    (v_uid, '冯雪',   'fengxue@alibaba.com',       '13900005555', c_alibaba,   'lost',   '预算被砍,本季度暂停',                      now() - interval '50 days'),
    (v_uid, '蒋楠',    NULL,                        '13900006666', NULL,        'lead',   '朋友介绍的潜在客户',                       now() - interval '55 days'),

    -- ---------- 2 个月前(5 条) ----------
    (v_uid, '韩雪',   'hanxue@meituan.com',        '13700001111', c_meituan,   'active', '骑手平台数据接入项目,稳定续费',            now() - interval '62 days'),
    (v_uid, '曹峰',   'caofeng@bytedance.com',     '13700002222', c_bytedance, 'active', '广告主 BD,月均消耗稳定',                   now() - interval '70 days'),
    (v_uid, '沈倩',   'shenqian@pingan.com',       '13700003333', c_pingan,    'lead',   '团险线索,等 HR 反馈',                      now() - interval '75 days'),
    (v_uid, '彭宇',   'pengyu@xueersi.com',        '13700004444', c_xueersi,   'lost',   '内部转岗,合作终止',                        now() - interval '80 days'),
    (v_uid, '吕静',   'lvjing@xiaomi.com',         '13700005555', c_xiaomi,    'active', '智能家居供应链合作',                       now() - interval '85 days'),

    -- ---------- 3 个月前(4 条) ----------
    (v_uid, '马涛',   'matao@cmb.com',             '13600001111', c_cmb,       'active', '信用卡部门,推进数据合作',                  now() - interval '95 days'),
    (v_uid, '丁萌',   'dingmeng@uhg.com',          '13600002222', c_united,    'lead',   '医疗 CRM 评估中',                          now() - interval '100 days'),
    (v_uid, '叶青',   'yeqing@sf-express.com',     '13600003333', c_shunfeng,  'lost',   '价格未达成一致,转向竞品',                  now() - interval '110 days'),
    (v_uid, '范琳',   'fanlin@alibaba.com',        '13600004444', c_alibaba,   'active', '国际站老客户,稳定使用',                    now() - interval '115 days'),

    -- ---------- 4 个月前(3 条) ----------
    (v_uid, '苏芮',   'surui@tencent.com',         '13500001111', c_tencent,   'active', '企业微信深度集成客户',                     now() - interval '125 days'),
    (v_uid, '高远',   'gaoyuan@bytedance.com',     '13500002222', c_bytedance, 'lead',   '飞书 ISV 合作,资质审核中',                 now() - interval '135 days'),
    (v_uid, '潘磊',   'panlei@meituan.com',        '13500003333', c_meituan,   'lost',   '内部决策周期太长,放弃',                    now() - interval '145 days'),

    -- ---------- 5 个月前(4 条) ----------
    (v_uid, '邓雯',   'dengwen@pingan.com',        '13400001111', c_pingan,    'active', '车险数据 API 长期合作方',                  now() - interval '155 days'),
    (v_uid, '林昊',   'linhao@xiaomi.com',         '13400002222', c_xiaomi,    'lost',   '组织架构调整,联系人离职',                  now() - interval '165 days'),
    (v_uid, '魏然',   'weiran@uhg.com',            '13400003333', c_united,    'active', '医院信息化项目长期对接',                   now() - interval '170 days'),
    (v_uid, '袁帆',    NULL,                        '13400004444', NULL,        'lead',   '行业峰会演讲嘉宾,后续跟进',                now() - interval '175 days');

  RAISE NOTICE '种子数据写入完成: 10 家公司 + 30 个联系人,绑定到用户 %', v_uid;
END $$;
