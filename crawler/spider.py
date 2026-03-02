import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# 数据存储路径
DATA_DIR = "../public/data"
os.makedirs(DATA_DIR, exist_ok=True)
DATA_FILE = f"{DATA_DIR}/standards.json"

# 现有数据加载
def load_existing_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# 保存数据
def save_data(data):
    # 去重：按标准编号去重
    seen = set()
    unique_data = []
    for item in data:
        if item["standardNo"] not in seen:
            seen.add(item["standardNo"])
            unique_data.append(item)
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(unique_data, f, ensure_ascii=False, indent=2)
    print(f"✅ 保存了{len(unique_data)}条标准数据")

# 爬取国家标准全文公开系统
def crawl_gb():
    standards = []
    # 示例爬取逻辑，后续完善
    print("🔍 正在爬取国家标准全文公开系统...")
    # 这里后续补充具体爬取代码
    return standards

# 爬取全国标准信息公共服务平台
def crawl_std_samr():
    standards = []
    print("🔍 正在爬取全国标准信息公共服务平台...")
    # 这里后续补充具体爬取代码
    return standards

# 主函数
def main():
    existing_data = load_existing_data()
    print(f"📦 现有数据量：{len(existing_data)}条")
    
    # 逐个爬取数据源
    gb_data = crawl_gb()
    samr_data = crawl_std_samr()
    
    # 合并数据
    all_data = existing_data + gb_data + samr_data
    
    # 保存
    save_data(all_data)
    
    # 更新爬取日志
    log_data = {
        "lastCrawlTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "totalCount": len(all_data)
    }
    with open(f"{DATA_DIR}/crawl_log.json", "w", encoding="utf-8") as f:
        json.dump(log_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
