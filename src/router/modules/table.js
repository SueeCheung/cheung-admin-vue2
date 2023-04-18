// /** When your routing Table is too long, you can split it into small modules **/

// import Layout from '@/layout'

// const tableRouter = {
//   path: '/Table',
//   component: Layout,
//   redirect: '/Table/complex-Table',
//   name: 'Table',
//   meta: {
//     title: 'Table',
//     icon: 'Table'
//   },
//   children: [
//     {
//       path: 'dynamic-Table',
//       component: () => import('@/views/Table/dynamic-Table/index'),
//       name: 'DynamicTable',
//       meta: { title: 'Dynamic Table' }
//     },
//     {
//       path: 'drag-Table',
//       component: () => import('@/views/Table/drag-Table'),
//       name: 'DragTable',
//       meta: { title: 'Drag Table' }
//     },
//     {
//       path: 'inline-edit-Table',
//       component: () => import('@/views/Table/inline-edit-Table'),
//       name: 'InlineEditTable',
//       meta: { title: 'Inline Edit' }
//     },
//     {
//       path: 'complex-Table',
//       component: () => import('@/views/Table/complex-Table'),
//       name: 'ComplexTable',
//       meta: { title: 'Complex Table' }
//     }
//   ]
// }
// export default tableRouter
