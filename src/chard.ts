(async () => {
  const action = process.argv.slice(2)[0];
  switch (action) {
    case 'deployed':
      break;
    case 'pending':
      break;
    case 'ready':
      break;
    case 'destroyed':
      break;
    case undefined:
      throw new Error(`[Chard] Action not provided.`);
    default:
      throw new Error(`[Chard] Action ${action} not supported.`);
  }
})();
