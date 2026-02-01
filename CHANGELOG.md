# Changelog

## [1.2.1](https://github.com/andreysey/proadmin-dashboard/compare/v1.2.0...v1.2.1) (2026-02-01)


### Bug Fixes

* **i18n:** fix typo in German footer translation ([d22ccd6](https://github.com/andreysey/proadmin-dashboard/commit/d22ccd6d3009ce8b2d0b657a8c539b9621e44c26))

## [1.2.0](https://github.com/andreysey/proadmin-dashboard/compare/v1.1.0...v1.2.0) (2026-02-01)


### Features

* **a11y:** fix button contrast, add missing translations, and harden a11y checks ([7c55887](https://github.com/andreysey/proadmin-dashboard/commit/7c5588700ba88e7750a7d5780a7b0c1255e67755))
* **a11y:** improve login page accessibility and axe-core config ([1a71e8e](https://github.com/andreysey/proadmin-dashboard/commit/1a71e8e2cc1125f31c061d770148f89e09527cb4))
* complete i18n coverage, optimize assets, and fix linting ([1d13fcd](https://github.com/andreysey/proadmin-dashboard/commit/1d13fcd1f32759088d34a263a02bf1d93cc0faf2))
* **header:** implement UserDropdown with account actions ([d1c08a0](https://github.com/andreysey/proadmin-dashboard/commit/d1c08a056e29cc2e958345be413c2023308e58d0))
* **i18n:** expand localization coverage for Dashboard and User List ([23c6562](https://github.com/andreysey/proadmin-dashboard/commit/23c65623ea4edd34072898fa1bb9b7008cb05cb5))
* **infra:** integrate Sentry for error tracking ([c188a9b](https://github.com/andreysey/proadmin-dashboard/commit/c188a9b7061a790d896e4a1efe422531fb8d4396))
* **mobile:** implement comprehensive Mobile UX suite ([fcb2480](https://github.com/andreysey/proadmin-dashboard/commit/fcb248056feac12dacb1176da7cbf65151c85e41))
* **mobile:** implement long-press selection and haptic feedback ([9c2987d](https://github.com/andreysey/proadmin-dashboard/commit/9c2987d65f4fa6e4750ee6543d720fbd49694518))
* **social:** integrate GitHub and LinkedIn links ([6fe9c77](https://github.com/andreysey/proadmin-dashboard/commit/6fe9c77480ac37a414548948868c0a608db059f0))
* **users:** implement concurrent-safe optimistic UI updates ([3d702ad](https://github.com/andreysey/proadmin-dashboard/commit/3d702add2caffef525a1d64325da98b0546ce4ba))


### Bug Fixes

* **i18n:** add missing translation keys and harmonize locales ([cca6e40](https://github.com/andreysey/proadmin-dashboard/commit/cca6e40152ce6063291c2583ae82462d48340f6c))
* resolve accessibility violations and build errors ([818267f](https://github.com/andreysey/proadmin-dashboard/commit/818267f8e111ab62e37a9cecf744a427c18b6e35))
* **storybook:** improve docs visibility and clean up styles ([1358385](https://github.com/andreysey/proadmin-dashboard/commit/1358385eb827a3a561f169f26556f8e30df52714))
* **ui:** enable functional mode toggle and styled toasts in storybook ([a022890](https://github.com/andreysey/proadmin-dashboard/commit/a022890d4535d6ed1d69625a57013a2ece747bee))
* vercel spa routing rewrites ([26d2904](https://github.com/andreysey/proadmin-dashboard/commit/26d2904b381383e6621b53827f76f2b8413f2a24))

## [1.1.0](https://github.com/andreysey/proadmin-dashboard/compare/v1.0.0...v1.1.0) (2026-02-01)


### Features

* **infra:** prepare for production deployment and monitoring ([3caf673](https://github.com/andreysey/proadmin-dashboard/commit/3caf6735a30a60e5d327700ee1d628075ea5df25))
* **ui:** enhance responsive design for login and dashboard ([93758d7](https://github.com/andreysey/proadmin-dashboard/commit/93758d73669c06e455c757ddeb1b51fa21c670b8))
* **ui:** implement responsive layout and mobile sidebar ([53f607d](https://github.com/andreysey/proadmin-dashboard/commit/53f607d45a81704e6c798d1eef4093b91f2887a4))
* **users:** implement responsive list with mobile card view ([ac5f066](https://github.com/andreysey/proadmin-dashboard/commit/ac5f066e5d0b25578a08260b42f909a668a8bca4))


### Performance Improvements

* optimize bundle size with lazy loading and improved chunking ([5d4fc07](https://github.com/andreysey/proadmin-dashboard/commit/5d4fc07f31df76d1a76e1f1b090ea68953268844))

## 1.0.0 (2026-01-31)


### Features

* **analytics:** add analytics entity with types, schemas, and API ([3141baf](https://github.com/andreysey/proadmin-dashboard/commit/3141baf04f7845f89e30ecc3880c4d4fe4654543))
* **analytics:** add dashboard visualizations with theme support ([205f8b3](https://github.com/andreysey/proadmin-dashboard/commit/205f8b35ea769b563fb131b0287f3a7bd28bfe0e))
* **auth/ui:** implement silent token rotation and advanced UI polish ([62949a4](https://github.com/andreysey/proadmin-dashboard/commit/62949a4643ab037384f752f647ea4a1055fd278c))
* **auth:** implement login page and utilities ([51e205f](https://github.com/andreysey/proadmin-dashboard/commit/51e205f19804616973a06bb3e2738f636c5099b1))
* **auth:** implement silent token rotation and reactive security layer ([e6c84e1](https://github.com/andreysey/proadmin-dashboard/commit/e6c84e15a1fe25a5d1d8d6761400ef371e1c8679))
* complete Stage 2 with Bulk Role Change and project roadmap update ([824c465](https://github.com/andreysey/proadmin-dashboard/commit/824c465b3d3427dbbd9d1dc6b2f9b0642c23c2eb))
* **dashboard:** add auto-refresh toggle with 30s polling ([ec16d7e](https://github.com/andreysey/proadmin-dashboard/commit/ec16d7e791c21fa941417989e2687eed664a9718))
* **dashboard:** add data export (Excel/PDF) ([29414a4](https://github.com/andreysey/proadmin-dashboard/commit/29414a4032a9c973e07aa815013a675fe1540e26))
* **dashboard:** add date range filter with URL state ([a623454](https://github.com/andreysey/proadmin-dashboard/commit/a6234540aa525a746b4f036c99fcf6e869eb7f42))
* **dashboard:** pass dateRange filter to API and fix login form ([e096b08](https://github.com/andreysey/proadmin-dashboard/commit/e096b0810fed13091c9d2267126e40a209b65c99))
* **entities:** add Zod runtime validation for User API responses ([a9b89b4](https://github.com/andreysey/proadmin-dashboard/commit/a9b89b4e7cfb6bd230c9b11545101b11e76226df))
* implement auth system (stage 1) ([abbdc8d](https://github.com/andreysey/proadmin-dashboard/commit/abbdc8daab4d43bdd8a7c378870fce819966d910))
* implement bulk actions for users list ([3b479bb](https://github.com/andreysey/proadmin-dashboard/commit/3b479bb0e4cf6e10fac82d2debcdaa6e702ecd44))
* implement delete user functionality with stateful MSW mocking and URL state sync ([08b5581](https://github.com/andreysey/proadmin-dashboard/commit/08b55817d2ddfaba90357e76978d7bf541b30389))
* implementation of Stage 2 - Advanced User Management ([7521615](https://github.com/andreysey/proadmin-dashboard/commit/752161590bf67198ad5c0e995fbc2166f0258b7c))
* initialize project with tailwind v4, shadcn/ui and core dependencies ([9429ce1](https://github.com/andreysey/proadmin-dashboard/commit/9429ce148fce93b04d91c9809abcca00cbba9faa))
* **mocks:** configure msw for development ([589f682](https://github.com/andreysey/proadmin-dashboard/commit/589f6825c7fb68b50e6db35435ace5c99507e307))
* modernize login page with animated background and premium styling ([f79fd13](https://github.com/andreysey/proadmin-dashboard/commit/f79fd13066d1497b9fbd0018bbeb70c6c31349bc))
* **rbac:** implement granular role-based access control (Stage 3) ([61934d1](https://github.com/andreysey/proadmin-dashboard/commit/61934d19a0500995a5c9d0c4ebcfa439fc6f9830))
* **rbac:** implement rbac infrastructure and ui protection ([d59f587](https://github.com/andreysey/proadmin-dashboard/commit/d59f587c0b6345d855c72b530ac106bf520b7848))
* **router:** add 404 Not Found page for invalid routes ([bbb9341](https://github.com/andreysey/proadmin-dashboard/commit/bbb9341be1fc80081669d4d8c5f5884e05780d85))
* **router:** implement TanStack Router and setup initial routes ([64238c4](https://github.com/andreysey/proadmin-dashboard/commit/64238c4ab3714821e5ee880174ccb11eb3c2f77c))
* setup core architecture, dashboard layout, and devtools ([f9174b5](https://github.com/andreysey/proadmin-dashboard/commit/f9174b5f07501538ea04f1e85005ec0d5632a4da))
* setup global providers with tanstack query ([8a8ae81](https://github.com/andreysey/proadmin-dashboard/commit/8a8ae8120be3eeb64bcfd31ff05a26384a9941d2))
* **shared:** add 500 Internal Server Error global handler ([70951ba](https://github.com/andreysey/proadmin-dashboard/commit/70951ba4f6f7d0d8709264bef4b19ab8158e2fc7))
* **shared:** add Global Error Boundary using react-error-boundary ([f8e47e2](https://github.com/andreysey/proadmin-dashboard/commit/f8e47e2d08f2e786a441116b6aecd36ae9f94640))
* **shared:** setup api client and environment configuration ([38eafa5](https://github.com/andreysey/proadmin-dashboard/commit/38eafa57cfadfecc92974135abbaca6b3bdeacc1))
* **test:** add Playwright E2E setup and auth verification flow ([6508c18](https://github.com/andreysey/proadmin-dashboard/commit/6508c182502a26e28bf44cd0f3c38d8fbdd582a6))
* **test:** implement 100% test coverage for critical modules (#stage6) ([7fafb5e](https://github.com/andreysey/proadmin-dashboard/commit/7fafb5efbde4de6fe4d2a1d60fb151850b825603))
* **theme:** finalize dark mode and refactor table styles ([08f8979](https://github.com/andreysey/proadmin-dashboard/commit/08f897997d8de2021f6e2e48267a0f740d376da3))
* **ui:** add dev role selector and enhance about page ([fb393d4](https://github.com/andreysey/proadmin-dashboard/commit/fb393d4bf521242807f115aea0815416725738ab))
* unify dashboard controls and finalize system-wide dark mode ([912a07d](https://github.com/andreysey/proadmin-dashboard/commit/912a07da5d167bc637c0685eb9eb92dba4c69d79))
* **user-management:** implement edit user functionality ([6993747](https://github.com/andreysey/proadmin-dashboard/commit/69937472a2ba6d96b23a05360349cd344a74c7b0))
* **users:** add actions column and refactor button variants ([6f239ae](https://github.com/andreysey/proadmin-dashboard/commit/6f239ae86d2f5eb88410d89f8d58f9be5e8f325d))
* **users:** implement server-side pagination ([a40cb0e](https://github.com/andreysey/proadmin-dashboard/commit/a40cb0e6427f83e981cb6f6627a071f82bd650b1))
* **users:** implement user list table with routing and msw fixes ([8acfa6c](https://github.com/andreysey/proadmin-dashboard/commit/8acfa6c01068d6e59d45b2ed157e6ddd921d87eb))
* **users:** implement user search with debounce ([10954a0](https://github.com/andreysey/proadmin-dashboard/commit/10954a0e7c515434f42f869d52b7af0ea7ed6604))
* **widgets:** add ActivityChart widget with Recharts area chart ([295bed9](https://github.com/andreysey/proadmin-dashboard/commit/295bed9aea6fc007fc43da1a98f46c1f8a1d58c1))
* **widgets:** add RecentActivityFeed widget with event timeline ([afc4162](https://github.com/andreysey/proadmin-dashboard/commit/afc4162492b234cfa1a6b7345a7754e54568ba30))
* **widgets:** add StatsOverview widget with analytics integration ([cdc9ecf](https://github.com/andreysey/proadmin-dashboard/commit/cdc9ecfd28cc2105c5d3b489ff5d337388a06825))


### Bug Fixes

* **auth:** make version dynamic and cleanup test logs in LoginForm ([ec2af35](https://github.com/andreysey/proadmin-dashboard/commit/ec2af358080682a33571f506009a96951f104d50))
* **build:** resolve ci/cd issues, router generation and strict types ([69022c2](https://github.com/andreysey/proadmin-dashboard/commit/69022c2e9647bcbd256bd9d004a784bf18e3ebe2))
* **ci:** rename files to lowercase to match imports ([7049c67](https://github.com/andreysey/proadmin-dashboard/commit/7049c6732c326523fd98d64e7a384e50c473bf41))
* resolve lint error in mock handlers and update roadmap ([694b77e](https://github.com/andreysey/proadmin-dashboard/commit/694b77e6d6cfbc2f107545b28acca1eef4f284b8))
* the Husky pre-commit hook configuration ([236851d](https://github.com/andreysey/proadmin-dashboard/commit/236851d2e9378fa76fb411e9c6b5b7f258329392))
* **ui:** resolve cascading render in ModeToggle ([b2f3bd3](https://github.com/andreysey/proadmin-dashboard/commit/b2f3bd35543aaf727d8c5fc55191ffa6a8c25a09))
* **users-list:** add image fallback to prevent empty src warning ([13be088](https://github.com/andreysey/proadmin-dashboard/commit/13be0887b8156f5b9fd673e09e9f413804af3b3b))
