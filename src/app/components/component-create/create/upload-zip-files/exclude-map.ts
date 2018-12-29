export const excludeMap = {
    mac: {
        name: '__MACOSX',
        reg: /__MACOSX\//,
        desc: 'Mac 系统生成临时目录，强制忽略',
        canConfig: false,
    },
    nodeModules: {
        name: 'node_modules',
        reg: /node_modules\//,
        desc: 'Node 安装包依赖目录，强制忽略',
        canConfig: false,
    },
    git: {
        name: '.git',
        reg: /\.git\//,
        desc: 'Git 客户端代码库，强制忽略',
        canConfig: false,
    },
    idea: {
        name: '.idea',
        reg: /\.idea\//,
        desc: '编辑器配置目录，强制忽略',
        canConfig: false,
    },
    vscode: {
        name: '.vscode',
        reg: /\.vscode/,
        desc: '编辑器配置目录，强制忽略',
        canConfig: false,
    },
    dist: {
        name: 'dist',
        reg: /\/dist\//,
        desc: '存放源代码生成文件，建议忽略',
        canConfig: true,
    },
    logs: {
        name: 'logs',
        reg: /\/logs\//,
        desc: '一般为日志目录，建议忽略',
        canConfig: true,
    },
    log: {
        name: '*.log',
        reg: /\.log$/,
        desc: '一般为日志文件，建议忽略',
        canConfig: true,
    },
    minJs: {
        name: '*.min.js',
        reg: /\.min\.js$/,
        desc: '一般为Js 压缩文件，建议忽略',
        canConfig: true,
    },
    map: {
        name: '*.map',
        reg: /\.map$/,
        desc: '一般为Js 生成的 map 文件，建议忽略',
        canConfig: true,
    },
    dsStore: {
        name: '.DS_Store',
        reg: /\.DS_Store/,
        desc: 'Mac 系统生成临时文件，强制忽略',
        canConfig: false,
    },
};
