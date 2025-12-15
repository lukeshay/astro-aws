# Guide: Performance Optimization

## Overview

Optimize your Astro AWS deployment for better performance and cost efficiency.

## Sections

1. Cache Policy Tuning
2. Price Class Selection
3. Lambda Memory & Timeout Optimization
4. Architecture Selection (ARM vs x86)
5. CloudFront Optimization
6. Cost Optimization Tips

## Key Code Examples

- Cache policy with TTL configuration
- Price class selection (PRICE_CLASS_100 vs PRICE_CLASS_ALL)
- Lambda memory sizing
- ARM64 vs x86_64 architecture
- Min TTL configuration

## References

- apps/infra/src/lib/stacks/website-stack.ts (lines 97-101, 144-147, 154)
