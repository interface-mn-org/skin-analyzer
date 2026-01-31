import type { AnalysisResults } from './types'

export const mockAnalysisResults: AnalysisResults = {
  overallSummary:
    'Your skin shows healthy characteristics with minor areas that could benefit from targeted care. Overall hydration levels are good, with slight oiliness in the T-zone area.',
  recommendation:
    'We recommend a gentle daily cleanser, lightweight moisturizer with SPF 30+, and incorporating a vitamin C serum in your morning routine for brightness.',
  images: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Forehead Analysis',
      description: 'Minimal fine lines detected. Good hydration levels with slight oiliness.',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
      title: 'Left Cheek',
      description: 'Healthy texture observed. Pores are within normal range.',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
      title: 'Right Cheek',
      description: 'Even skin tone with good elasticity. Minor dryness noted.',
    },
    {
      id: '4',
      imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      title: 'Nose Area',
      description: 'Visible pores in T-zone. Recommend pore-minimizing treatment.',
    },
    {
      id: '5',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop',
      title: 'Chin Region',
      description: 'Slight congestion detected. Exfoliation may help improve clarity.',
    },
    {
      id: '6',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Under Eye Area',
      description: 'Minor dark circles present. Eye cream with caffeine recommended.',
    },
  ],
}
