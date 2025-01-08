
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes"/>
    <xsl:template match="/">
        <html>
            <head>
                <title>Hockey Teams and Players</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Hockey Teams and Players</h1>
                <xsl:for-each select="hockey/Team">
                    <h2><xsl:value-of select="TeamName"/> (Founded: <xsl:value-of select="FoundationYear"/>)</h2>
                    <p>City: <xsl:value-of select="City"/></p>
                    <table>
                        <thead>
                            <tr>        <th>Player Name</th>        <th>Position</th>
                                <th>Jersey Number</th>
                            </tr></thead>
                        <tbody>    <xsl:for-each select="Players/Player">
                                <xsl:sort select="Position"/>
                                <tr>
            <td><xsl:value-of select="PlayerName"/></td>
                <td>
                    <xsl:value-of select="Position"/>
                    <xsl:if test="Position='Goalie'">  (Key Player)
                    </xsl:if>
                </td>
                <td>
                <xsl:choose>
                <xsl:when test="JerseyNumber &lt; 10">
                <strong><xsl:value-of select="JerseyNumber"/></strong>
                </xsl:when>
                <xsl:otherwise>
                            <xsl:value-of select="JerseyNumber"/>
                </xsl:otherwise>
                                                </xsl:choose>
        </td>
                                </tr>
                                </xsl:for-each>
            </tbody>
                </table>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
