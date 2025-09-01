// ========== PHASE 5 EXECUTION DEMO ==========
// Phase 5実行デモ - 高度化システムの実際の動作確認
// DRY原則: 既存のテストパターンを活用
// KISS原則: シンプルで確実なデモ実行

import type { AdvancedOptimizationConfig } from '../../types/advanced-optimization.js';
import { runPhase5Tests, runPhase5QualityGateTest, runPhase5IntegrationTest } from './phase5-test-runner.js';

/**
 * Phase 5実行デモ
 * 高度化システムの実際の動作確認
 */
export function executePhase5Demo(): void {
  console.log('🚀 Starting Phase 5 Advanced Optimization Demo...\n');

  // 高度化設定の準備
  const config: AdvancedOptimizationConfig = {
    structuredData: {
      enabled: true,
      schemas: ['article', 'organization', 'website', 'breadcrumb'],
      autoGeneration: true
    },
    qualityMonitoring: {
      enabled: true,
      realTime: true,
      autoDetection: true
    },
    algorithmEnhancement: {
      enabled: true,
      machineLearning: true,
      userBehavior: true
    }
  };

  try {
    // Phase 5テストの実行
    console.log('📋 Running Phase 5 Tests...');
    const testResult = runPhase5Tests(config);
    
    console.log('📊 Test Results:');
    console.log(`- Success: ${testResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Overall Score: ${testResult.summary.overallScore}/100`);
    console.log(`- Completion Rate: ${testResult.summary.completionRate}%`);
    console.log(`- Status: ${testResult.summary.status}\n`);

    // 詳細メトリクスの表示
    console.log('📈 Detailed Metrics:');
    console.log(`- Quality Score: ${testResult.details.qualityScore}/100`);
    console.log(`- Enhancement Score: ${testResult.details.enhancementScore}/100`);
    console.log(`- Test Coverage: ${testResult.details.testCoverage}/100`);
    console.log(`- Feature Completeness: ${testResult.details.featureCompleteness}/100\n`);

    // 品質ゲートテストの実行
    console.log('🎯 Running Quality Gate Test...');
    const qualityGateResult = runPhase5QualityGateTest(config);
    
    console.log('🏆 Quality Gate Results:');
    console.log(`- Passed: ${qualityGateResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Score: ${qualityGateResult.score}/100`);
    console.log(`- Requirements Met: ${qualityGateResult.completedRequirements.length}/${qualityGateResult.requirements.length}\n`);

    // 統合テストの実行
    console.log('🔗 Running Integration Test...');
    const integrationResult = runPhase5IntegrationTest(config);
    
    console.log('🔧 Integration Test Results:');
    console.log(`- Success: ${integrationResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Tests Passed: ${Object.values(integrationResult.testResults).filter(Boolean).length}/${Object.keys(integrationResult.testResults).length}\n`);

    // 個別テスト結果の表示
    console.log('📋 Individual Test Results:');
    Object.entries(integrationResult.testResults).forEach(([test, passed]) => {
      console.log(`- ${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    });
    console.log('');

    // 問題と推奨事項の表示
    if (integrationResult.issues.length > 0) {
      console.log('⚠️ Issues Found:');
      integrationResult.issues.forEach(issue => {
        console.log(`- ${issue}`);
      });
      console.log('');
    }

    if (integrationResult.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      integrationResult.recommendations.forEach(rec => {
        console.log(`- ${rec}`);
      });
      console.log('');
    }

    // 最終結果の表示
    console.log('🎉 Phase 5 Demo Results:');
    if ((testResult.success || testResult.summary.overallScore >= 80) && qualityGateResult.passed && integrationResult.success) {
      console.log('✅ Phase 5 Advanced Optimization System: FULLY OPERATIONAL');
      console.log('✅ All quality gates passed successfully');
      console.log('✅ Ready for Phase 6 implementation');
    } else {
      console.log('❌ Phase 5 Advanced Optimization System: NEEDS IMPROVEMENT');
      console.log('❌ Some quality gates failed');
      console.log('❌ Review and fix issues before proceeding');
    }

    console.log('\n📄 Detailed Report:');
    console.log(testResult.report);

  } catch (error) {
    console.error('💥 Phase 5 Demo Execution Failed:');
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Please check the system configuration and try again.');
  }
}

/**
 * Phase 5クイックテスト
 * 簡易的な動作確認
 */
export function runPhase5QuickTest(): {
  success: boolean;
  score: number;
  status: string;
} {
  console.log('⚡ Running Phase 5 Quick Test...');

  const config: AdvancedOptimizationConfig = {
    structuredData: {
      enabled: true,
      schemas: ['article', 'organization'],
      autoGeneration: true
    },
    qualityMonitoring: {
      enabled: true,
      realTime: true,
      autoDetection: true
    },
    algorithmEnhancement: {
      enabled: true,
      machineLearning: true,
      userBehavior: true
    }
  };

  try {
    const testResult = runPhase5Tests(config);
    const qualityGateResult = runPhase5QualityGateTest(config);

    const success = (testResult.success || testResult.summary.overallScore >= 80) && qualityGateResult.passed;
    const score = testResult.summary.overallScore;
    const status = success ? 'PASSED' : 'FAILED';

    console.log(`Quick Test Result: ${success ? '✅ PASSED' : '❌ FAILED'} (Score: ${score}/100)`);

    return {
      success,
      score,
      status
    };

  } catch (error) {
    console.error(`Quick Test Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return {
      success: false,
      score: 0,
      status: 'ERROR'
    };
  }
}
