import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [standards, setStandards] = useState([])
  const [filteredStandards, setFilteredStandards] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [crawlLog, setCrawlLog] = useState({})

  // 分类配置
  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'warehouse', label: '🏭 仓储类' },
    { value: 'logistics', label: '🚚 物流类' },
    { value: 'ecommerce', label: '🛒 电商类' }
  ]

  const types = [
    { value: 'all', label: '全部状态' },
    { value: 'current', label: '现行' },
    { value: 'abolished', label: '废止' },
    { value: 'upcoming', label: '即将实施' }
  ]

  // 加载数据
  useEffect(() => {
    fetch('/data/standards.json')
      .then(res => res.json())
      .then(data => {
        setStandards(data)
        setFilteredStandards(data)
      })
      .catch(err => console.log('暂无数据，爬虫运行后自动生成'))

    fetch('/data/crawl_log.json')
      .then(res => res.json())
      .then(data => setCrawlLog(data))
      .catch(err => {})
  }, [])

  // 筛选逻辑
  useEffect(() => {
    let result = [...standards]
    
    // 关键词搜索
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      result = result.filter(item => 
        item.standardNo.toLowerCase().includes(kw) ||
        item.name.toLowerCase().includes(kw) ||
        item.issuer.toLowerCase().includes(kw) ||
        item.summary.toLowerCase().includes(kw)
      )
    }

    // 分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory)
    }

    // 状态筛选
    if (selectedType !== 'all') {
      result = result.filter(item => item.status === selectedType)
    }

    setFilteredStandards(result)
  }, [searchKeyword, selectedCategory, selectedType, standards])

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>📦 中国仓储·物流·电商标准库</h1>
          <p className="subtitle">每日自动更新 · 免费查询 · 官方数据源</p>
          {crawlLog.lastCrawlTime && (
            <p className="update-time">最后更新：{crawlLog.lastCrawlTime} | 共{crawlLog.totalCount}条标准</p>
          )}
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* 搜索筛选区 */}
          <div className="filter-section">
            <input
              type="text"
              className="search-input"
              placeholder="搜索标准编号、名称、发布机构..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            
            <div className="filter-row">
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 列表区 */}
          <div className="list-section">
            {filteredStandards.length === 0 ? (
              <div className="empty-state">
                <p>暂无匹配的标准，爬虫首次运行后会自动填充数据~</p>
              </div>
            ) : (
              filteredStandards.map(item => (
                <div key={item.standardNo} className="standard-card">
                  <div className="card-header">
                    <span className="standard-no">{item.standardNo}</span>
                    <span className={`status status-${item.status}`}>
                      {item.status === 'current' ? '现行' : item.status === 'abolished' ? '废止' : '即将实施'}
                    </span>
                  </div>
                  <h3 className="standard-name">{item.name}</h3>
                  <div className="meta-info">
                    <span>🏛️ {item.issuer}</span>
                    <span>📅 发布：{item.publishDate}</span>
                    <span>✅ 实施：{item.implementDate}</span>
                    <span>🏷️ {categories.find(c => c.value === item.category)?.label}</span>
                  </div>
                  <p className="summary">{item.summary}</p>
                  {item.officialUrl && (
                    <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="official-link">
                      🔗 查看官方原文
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>数据来源：国家标准全文公开系统、全国标准信息公共服务平台、各部委官方网站</p>
        </div>
      </footer>
    </div>
  )
}

export default App
