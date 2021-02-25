export default `
.points,
.manual-check-warning {
  display: inline-block;
  margin-left: 14px;
  padding: 0 7px;
  border-radius: 2px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #389e0d;
  font-size: 12px;
  font-weight: 500;
  line-height: 15px;
  transform: translateY(-3px);
}

.points:empty {
  display: none;
}

.partial-points,
.manual-check-warning {
  background: #fffbe6;
  border-color: #ffe58f;
  color: #d48806;
}

.no-points {
  background: #fff1f0;
  border-color: #ffa39e;
  color: #cf1322;
}

.manual-check-warning {
  font-weight: 700;
}

.test .manual-check-warning {
  transform: none;
}

#mocha .test.pass.manual-check::before {
  content: '?';
  color: #d48806;
}

#mocha li.warnings {
  padding: 15px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d48806;
}

#mocha li.warnings h1 {
  margin: 0;
  font-weight: 700;
}

#mocha li.warnings pre {
  margin-bottom: 0;
  white-space: pre-wrap;
  font-size: 16px;
}
`;
