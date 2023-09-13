package io.holunda.polyflow.example.process.infrastructure

import org.hibernate.boot.model.TypeContributions
import org.hibernate.dialect.PostgreSQLDialect
import org.hibernate.engine.jdbc.dialect.spi.DialectResolutionInfo
import org.hibernate.service.ServiceRegistry
import org.hibernate.type.SqlTypes
import org.hibernate.type.descriptor.jdbc.BinaryJdbcType
import java.sql.Types


/**
 * Taken mostly from https://developer.axoniq.io/w/axonframework-and-postgresql-without-toast
 */
@Suppress("unused") // used in application.yaml
class NoToastPostgresSQLDialect(info: DialectResolutionInfo) : PostgreSQLDialect(info) {
  override fun columnType(sqlTypeCode: Int): String {
    return when (sqlTypeCode) {
      SqlTypes.BLOB -> "bytea"
      else -> super.columnType(sqlTypeCode)
    }
  }

  override fun castType(sqlTypeCode: Int): String {
    return when (sqlTypeCode) {
      SqlTypes.BLOB -> "bytea"
      else -> super.castType(sqlTypeCode)
    }
  }

  override fun contributeTypes(typeContributions: TypeContributions, serviceRegistry: ServiceRegistry?) {
    super.contributeTypes(typeContributions, serviceRegistry)
    val jdbcTypeRegistry = typeContributions.typeConfiguration.jdbcTypeRegistry
    jdbcTypeRegistry.addDescriptor(Types.BLOB, BinaryJdbcType.INSTANCE)
  }
}
