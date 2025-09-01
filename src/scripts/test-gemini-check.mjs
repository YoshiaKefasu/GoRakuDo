#!/usr/bin/env node

/**
 * 簡単なGemini API依存関係チェックスクリプト
 */

import fs from 'fs';

console.log('=== Gemini API依存関係チェック開始 ===');

// 1. package.jsonでの依存関係チェック
console.log('\n1. package.jsonでの依存関係チェック...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies['@google/genai']) {
    console.log(`⚠️  @google/genai v${packageJson.dependencies['@google/genai']} - 依存関係が存在します`);
  } else {
    console.log('✅ @google/genai - 依存関係なし');
  }
  
  if (packageJson.devDependencies && packageJson.devDependencies['@google/genai']) {
    console.log(`⚠️  @google/genai v${packageJson.devDependencies['@google/genai']} - dev依存関係が存在します`);
  }
} catch (error) {
  console.log(`❌ package.json読み込みエラー: ${error.message}`);
}

// 2. 環境変数での設定チェック
console.log('\n2. 環境変数での設定チェック...');
try {
  if (fs.existsSync('env.example')) {
    const envExample = fs.readFileSync('env.example', 'utf8');
    
    if (envExample.includes('GOOGLE_API_KEY')) {
      console.log('⚠️  env.example - GOOGLE_API_KEY設定が存在します');
    } else {
      console.log('✅ env.example - GOOGLE_API_KEY設定なし');
    }
    
    if (envExample.includes('GOOGLE_MODEL')) {
      console.log('⚠️  env.example - GOOGLE_MODEL設定が存在します');
    } else {
      console.log('✅ env.example - GOOGLE_MODEL設定なし');
    }
  } else {
    console.log('⚠️  env.example - ファイルが存在しません');
  }
  
  if (process.env.GOOGLE_API_KEY) {
    console.log('⚠️  環境変数 - GOOGLE_API_KEYが設定されています');
  } else {
    console.log('✅ 環境変数 - GOOGLE_API_KEY未設定');
  }
} catch (error) {
  console.log(`❌ 環境変数チェックエラー: ${error.message}`);
}

// 3. 主要ディレクトリの存在確認
console.log('\n3. 主要ディレクトリの存在確認...');
const directories = [
  'src',
  'GenAI-PostMetadata-Gemini(Deprecated)',
  'scripts'
];

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} - ディレクトリが存在します`);
  } else {
    console.log(`⚠️  ${dir} - ディレクトリが存在しません`);
  }
});

console.log('\n=== チェック完了 ===');

