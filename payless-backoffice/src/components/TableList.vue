<script setup>

</script>

<template>
  <table class="table-list-component">
    <thead>
      <slot name="head">
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </slot>
    </thead>
    <tbody>
      <slot name="body">
      </slot>
    </tbody>
  </table>
</template>

<style>
  .table-list-component {
    border-collapse: collapse;
    width: 100%;
  }

  .table-list-component th {
    font-weight: bold;
  }

  .table-list-component th, .table-list-component td {
    padding: 8px;
    text-align: left;
  }

  .table-list-component tbody tr:nth-child(odd) {
    background-color: #FDF7F2;
  }

  .table-list-component tbody tr:nth-child(even) {
    background-color: #fff;
  }
</style>

